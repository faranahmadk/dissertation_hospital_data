import { Injectable } from '@nestjs/common';

@Injectable()
export class ZkSnarkService {
  private baseUrl = 'http://172.29.14.163:8080';

  async generateProof(data: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/generate-proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: data }),
    });
    if (!response.ok) throw new Error(`Failed to generate proof: ${response.status}`);
    return await response.json();
  }

  async verifyProof(proof: any): Promise<boolean> {
    if (!proof) throw new Error('Proof is required for verification');
  
    // Log the proof to check its structure before sending
    console.log("Proof Stringify JSON:", JSON.stringify(proof));
  
    // Prepare the proof object for sending
    const proofPayload = {
      proof: proof,  // Ensure 'proof' is the correct format for the backend
      public_input: proof.public_input || []  // Include public input if necessary
    };
  
    // Send the POST request to the verify-proof endpoint
    const response = await fetch(`${this.baseUrl}/verify-proof`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proofPayload),  // Send the serialized proof object
    });
  
    if (!response.ok) throw new Error(`Failed to verify proof: ${response.status}`);
  
    // Parse and return the response from the backend
    const responseData = await response.json();
    console.log('Verify Proof Response:', responseData);
    return responseData.valid || false;  // Check if the response indicates valid proof
  }
  
}