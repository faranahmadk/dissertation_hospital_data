use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use bellman::groth16::{
    create_random_proof, generate_random_parameters, prepare_verifying_key, verify_proof, Proof,
};
use bellman::{Circuit, ConstraintSystem, SynthesisError};
use bls12_381::{Bls12, G1Affine, G2Affine, Scalar as Fr};
use ff::{Field, PrimeField};
use lazy_static::lazy_static;
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::io::{Cursor, Read, Write};
use std::sync::Mutex;

#[derive(Deserialize)]
struct ProofRequest {
    input: u64,
}

#[derive(Clone)]
struct MyCircuit {
    pub a: Option<Fr>,
}

impl Circuit<Fr> for MyCircuit {
    fn synthesize<CS: ConstraintSystem<Fr>>(self, cs: &mut CS) -> Result<(), SynthesisError> {
        let a = cs.alloc(|| "a", || self.a.ok_or(SynthesisError::AssignmentMissing))?;
        let out = cs.alloc_input(
            || "public input",
            || {
                let val = self.a.ok_or(SynthesisError::AssignmentMissing)?;
                Ok(val.square())
            },
        )?;

        cs.enforce(|| "a * a = out", |lc| lc + a, |lc| lc + a, |lc| lc + out);

        Ok(())
    }
}

#[derive(Serialize, Deserialize)]
struct ProofResponse {
    proof: Vec<u8>,
    public_input: Vec<u8>,
}

lazy_static! {
    static ref PARAMS: Mutex<
        Option<(
            bellman::groth16::Parameters<Bls12>,
            bellman::groth16::PreparedVerifyingKey<Bls12>,
        )>,
    > = Mutex::new(None);
}

#[post("/generate-proof")]
async fn generate_proof(input: web::Json<ProofRequest>) -> impl Responder {
    let a_val = Fr::from(input.input);
    let output_val = a_val.square();

    let mut params_lock = PARAMS.lock().unwrap();
    if params_lock.is_none() {
        let params =
            generate_random_parameters::<Bls12, _, _>(MyCircuit { a: Some(a_val) }, &mut OsRng)
                .expect("parameter generation failed");

        let pvk = prepare_verifying_key(&params.vk);
        *params_lock = Some((params, pvk));
    }

    let (params, _) = params_lock.as_ref().unwrap();

    let proof = create_random_proof(MyCircuit { a: Some(a_val) }, params, &mut OsRng)
        .expect("proof generation failed");

    let mut proof_bytes = vec![];
    proof.write(&mut proof_bytes).unwrap();

    let public_input_bytes = output_val.to_bytes().to_vec();

    HttpResponse::Ok().json(ProofResponse {
        proof: proof_bytes,
        public_input: public_input_bytes,
    })
}

#[post("/verify-proof")]
async fn verify_proof_endpoint(
    proof_data: web::Json<ProofResponse>,
) -> Result<HttpResponse, actix_web::Error> {
    let proof = match Proof::<Bls12>::read(&mut Cursor::new(&proof_data.proof)) {
        Ok(p) => p,
        Err(_) => return Ok(HttpResponse::BadRequest().json("Invalid proof format")),
    };

    println!("Received Proof: {:?}", proof);
    println!("Received Public Input: {:?}", proof_data.public_input);

    let mut public_input = Vec::new();
    let mut cursor = Cursor::new(&proof_data.public_input);
    let mut buf = [0u8; 32];
    if cursor.read_exact(&mut buf).is_ok() {
        public_input.push(Fr::from_bytes(&buf).unwrap());
    }


    let params_lock = PARAMS.lock().unwrap();
    if params_lock.is_none() {
        return Ok(HttpResponse::InternalServerError().json("Parameters not initialized"));
    }
    let (_, pvk) = params_lock.as_ref().unwrap();

    // Verify the proof using the proof and parameters
    let is_valid = verify_proof(
        &pvk,          // Prepared verification key
        &proof,        // Proof generated
        &public_input, // Public input
    )
    .is_ok();

    // Return a response indicating whether the proof is valid or not
    if is_valid {
        Ok(HttpResponse::Ok().json(json!({
            "valid": true,
            "message": "Proof is valid!"
        })))
    } else {
        Ok(HttpResponse::Ok().json(json!({
            "valid": false,
            "message": "Proof is invalid!"
        })))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Starting Zero-Knowledge Proof service on http://localhost:8080");
    HttpServer::new(|| {
        App::new()
            .service(generate_proof)
            .service(verify_proof_endpoint)
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
