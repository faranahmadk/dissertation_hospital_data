## Dissertation - Karl Timmins

## Zero Knowledge Proofs - Irish Medical Sector

## Internal Working

Let's break down the structure and flow of a Zero-Knowledge Proof (ZKP) application for storing medical data, assuming a repository with `backend`, `frontend`, and `zksnark_service` components.

**I. Overall Architecture:**

The system aims to securely store and verify medical data without revealing the sensitive information itself.  This is achieved through ZKPs, which allow proving the validity of a statement (e.g., "I have access to this record") without revealing the statement's content (the record itself).

**II. Component Breakdown:**

* **`backend` (Server-side):**
    * **Database Interaction:** This component handles interactions with the database where encrypted medical data is stored.  The encryption is crucial; it ensures that even the database administrator cannot see the plaintext data.  Likely uses an encryption scheme compatible with the ZKP system (e.g., homomorphic encryption might be used depending on the specific ZKP scheme).
    * **ZKP Generation:**  When a user requests access to their data or needs to perform a verification, the backend generates the ZKP. This involves:
        1. **Data Preparation:** Preparing the medical data and the statement to be proven in a format suitable for the ZKP circuit.
        2. **Circuit Generation:**  Using a ZKP library (like libsnark, ZoKrates, or others), it generates a cryptographic circuit representing the statement. The circuit encodes the logic of the statement ("this user has access" or "this data satisfies condition X").
        3. **Witness Generation:**  Creating a "witness" – secret data required to prove the statement's validity. This would involve parts of the decrypted data (but not all of it).
        4. **Proof Generation:** Using the circuit and witness, the backend generates the ZKP.
    * **Proof and Public Input Handling:**  After generating the ZKP, the backend extracts the public inputs (data that can be publicly revealed without compromising privacy) and packages both the proof and public inputs into an event to be sent to the blockchain.
    * **API Endpoints:** Exposes APIs for the frontend to interact with, allowing users to request data access and receive the necessary proofs.

* **`frontend` (Client-side):**
    * **User Interface:** Provides a user-friendly interface for users to manage their medical data. This includes features for data input (encrypted on the client-side before sending to the backend), data access requests, and viewing verified data (potentially aggregated or partially revealed data).
    * **ZKP Verification:** After receiving the ZKP and public inputs from the backend, the frontend verifies the proof using the appropriate verification algorithm (also from the ZKP library used on the backend).  This ensures the integrity and validity of the proof.  The verification itself doesn't reveal the underlying data.
    * **Blockchain Interaction (optional):** In some designs, the frontend might directly interact with the blockchain to verify the event containing the proof and public inputs, providing an extra layer of trust and immutability.

* **`zksnark_service` (Optional, potentially integrated into the backend):**
    * This component could be a dedicated service focused solely on ZKP generation and verification.  It might be used to improve performance or scalability by separating this computationally intensive task from the main backend.  It would likely use a dedicated ZKP library.

**III. Flow of Operation:**

1. **Data Input:** The user provides their medical data through the frontend.  This data is encrypted locally before transmission to the backend.

2. **Data Storage:** The backend receives the encrypted data and securely stores it in the database.

3. **Access Request:** The user requests access to their data via the frontend.

4. **ZKP Generation:** The backend generates a ZKP proving that the user has access to the requested data without revealing the data itself.  This involves setting up the ZKP circuit and using the witness (related to the user's credentials and the data).

5. **Blockchain Event:** The backend sends an event to the blockchain containing the generated ZKP and its corresponding public inputs.

6. **Proof Verification:** The frontend receives the ZKP and public inputs from the event.  It verifies the ZKP locally using the public parameters and the verification algorithm.

7. **Data Access (Conditional):** If the verification is successful, the frontend can access (potentially partially or aggregately)  the data or a cryptographic representation of it,  ensuring privacy preservation.


**IV. Security Considerations:**

* **Secure Encryption:** Robust encryption is essential on both the client and server-side to protect data at rest and in transit.
* **Key Management:** Secure key management is crucial to prevent unauthorized access.
* **Circuit Design:**  The ZKP circuit must be carefully designed to precisely represent the desired statement without leaking unintended information.
* **Blockchain Integrity:** Reliance on the immutability and security of the chosen blockchain is paramount.

## App Flow
Let's delve into a more detailed explanation of the flow, including ZKP terminology, and then visualize it with a diagram.  We'll use a simplified example to illustrate the core concepts.  Remember, real-world implementations are significantly more complex.

**I. Detailed Flow:**

1. **User Registration and Data Input (Frontend):**
    * The user registers with the system, providing necessary identification information (e.g., username, password, potentially public key).  This information might be used to generate a unique identifier.
    * The user enters their medical data into the frontend application.  Crucially, *this data is encrypted on the client-side before transmission.*  A symmetric encryption key is generated locally; only the user knows this key.
    * The encrypted data, along with a metadata identifier (linking it to the user), is sent to the backend.

2. **Data Storage (Backend):**
    * The backend receives the encrypted data and metadata.
    * It stores both in its database. The database only stores ciphertext; the plaintext medical data is never stored directly.  The database might have access control mechanisms to ensure only authorized personnel can access the encrypted data (though even then, they cannot read it).

3. **Data Access Request (Frontend):**
    * The user requests access to their specific medical data via the frontend.  This request includes the user's identifier.

4. **ZKP Generation (Backend):**
    * The backend retrieves the encrypted data and corresponding metadata.
    * **Circuit Definition:** A ZKP circuit is defined. This circuit is a formal representation of the statement the user wants to prove.  For example, a simple circuit might represent:  "I know the encryption key for data with ID X".  This circuit does *not* reveal the actual data or the key itself.
    * **Witness Generation:** The backend generates a "witness." The witness is the secret data necessary to satisfy the circuit. In this case, it is a part of the encryption key (or a cryptographic commitment to it) – enough to satisfy the circuit without revealing the full key.  This step is computationally intensive.
    * **Proof Generation:** Using the circuit and the witness, the backend uses a ZKP library (libsnark, ZoKrates, etc.) to generate a ZKP. This proof cryptographically proves the statement (access to data) without revealing the witness (the key).
    * **Public Input Extraction:**  The public inputs are extracted. These are the pieces of information that can be publicly revealed (e.g., the data ID, user ID, and potentially some cryptographic hashes).

5. **Blockchain Event (Backend):**
    * The backend constructs an event containing the generated ZKP, the public inputs, and the user's ID. This event is sent to the blockchain.  This provides an immutable record of the proof.

6. **Proof Verification (Frontend):**
    * The frontend retrieves the blockchain event and obtains the ZKP and public inputs.
    * **Verification:** It uses the public parameters (provided by the backend or part of the blockchain event) and the verification algorithm (from the same ZKP library) to verify the proof.  If the proof is valid, it confirms that the user has legitimate access to the data without revealing anything about the data itself.

7. **Conditional Data Access (Frontend):**
    * If the ZKP verification is successful, the frontend can allow the user to access some aspect of the data.  This access might be limited (e.g., only aggregated statistics, or access to specific fields).  The data remains encrypted; decryption happens only on the user's device using their secret key.


**II. ZKP Terminologies:**

* **Zero-Knowledge Proof (ZKP):** A cryptographic proof that allows one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any information beyond the truth of the statement itself.

* **Circuit:** A formal representation of the statement to be proven. It's a computational graph that encodes the logic of the statement. Think of it as a program that operates on the witness and outputs a result.

* **Witness:** The secret data required to satisfy the circuit.  It's the information the prover knows that allows them to prove the statement.

* **Prover:** The party generating the ZKP. In this case, the backend server.

* **Verifier:** The party verifying the ZKP. In this case, the frontend client.

* **Public Input:** Data that can be revealed publicly without compromising privacy.  This is used in the verification process.

* **Public Parameters:**  Parameters needed for both the proof generation and verification. These are often generated once and reused for many proofs.

* **Proof:** The cryptographic output of the ZKP generation process.  It's a compact representation of the proof that the statement is true.


**III. Diagram:**

```
+-----------------+     +-----------------+     +-----------------+     +-----------------+
|   Frontend      |---->|   Backend       |---->|   Blockchain    |---->|   Frontend      |
+-----------------+     +-----------------+     +-----------------+     +-----------------+
      ^                                                                       |
      |                                                                       |
      +-----------------------------------------------------------------------+
                                         |
                                         v
                               +-----------------+
                               |  User Data      |  (Encrypted on client-side)
                               | (Encrypted)     |
                               +-----------------+

                                  ZKP Generation
                                    (Circuit, Witness, Proof)
                                     Event Creation (Proof, Public Inputs)
                                         Verification Process
```


This diagram simplifies the complex cryptographic steps within the backend. The key takeaway is the unidirectional flow of the ZKP and public inputs to the blockchain and the verification on the client-side, maintaining data privacy.  The encrypted data remains on the backend, never fully exposed.

## ZKP Generation
The interaction would look like this:
1. The frontend sends a data access request to the main backend.
2. The main backend forwards the request (possibly after authentication) to the zksnark_service.
3. The zksnark_service performs ZK-SNARK generation.
4. The zksnark_service returns the proof and public inputs to the main backend.
5. The main backend sends the proof and public inputs to the blockchain and responds to the frontend.

## ZKP Verification
Let's break down the ZKP verification process, focusing on the key steps and the role of different components.  Remember that the specifics depend on the chosen ZK-SNARK scheme (e.g., Groth16, PlonK) and its associated library.  However, the general principles remain consistent.

**I. ZKP Verification Steps (Frontend):**

1. **Receiving the Proof and Public Inputs:** The frontend receives the ZKP and the associated public inputs from the blockchain event.  This information is publicly available and doesn't compromise the privacy of the underlying data.

2. **Obtaining Verification Parameters:**  The verification process needs certain parameters, often called "public parameters" or "verification key." These parameters are typically generated once during the ZK-SNARK setup phase (often done offline) and are independent of the specific proof.  These parameters might be:
    * **Verification Key (vk):**  This key is crucial for verifying the proof's validity.  It's a public piece of information that doesn't reveal the private information used in generating the proof.
    * **Other Parameters:** Depending on the specific ZK-SNARK scheme, there may be additional public parameters needed.

    * **Source of Verification Key:** The `vk` (and other parameters) might be:
        * Included in the blockchain event.
        * Obtained from a trusted source (e.g., a separate service or configuration file).
        * Hardcoded into the frontend (less secure, only suitable for prototype situations).

3. **Verification Algorithm:** The frontend uses a verification algorithm (provided by the ZK-SNARK library) to check the proof's validity.  This algorithm takes as input:
    * The ZKP itself.
    * The public inputs.
    * The verification key (`vk`) and any other necessary public parameters.

4. **Validity Check:**  The verification algorithm performs a series of cryptographic computations. The result is a boolean value:
    * **True:** The proof is valid.  The verifier is convinced that the prover (backend) knows the witness (secret information) that satisfies the circuit (the statement).  This doesn't reveal the witness itself.
    * **False:** The proof is invalid.  This means either the proof is forged or the statement is false.

5. **Action Based on Verification Result:**  Based on the verification result, the frontend proceeds accordingly:
    * **Valid Proof:** The frontend grants the user access to the data (potentially partially or in aggregated form, always keeping it encrypted).
    * **Invalid Proof:** The frontend denies access and might display an error message.


**II. Role of Different Components:**

* **Frontend:** Responsible for retrieving the proof and public inputs from the blockchain, obtaining the verification key, running the verification algorithm, and taking actions based on the outcome.

* **Backend:**  Generated the proof and provided the public inputs.  It also played a role (either directly or indirectly) in generating and distributing the verification key.

* **Blockchain:** Serves as a trusted and immutable record of the proof and public inputs.


**III. Security Considerations for Verification:**

* **Verification Key Security:**  The security of the verification key is paramount.  Compromising the `vk` would render the entire verification process insecure.

* **Library Integrity:**  Using a trusted and well-vetted ZK-SNARK library is crucial to avoid vulnerabilities.

* **Secure Storage:** The frontend should securely store the verification key, possibly using secure storage mechanisms if needed.

* **Input Validation:**  The frontend must carefully validate the public inputs to prevent manipulation or injection attacks.

**IV.  Example (Conceptual):**

Let's say the circuit represents the statement "I know the encryption key corresponding to medical record ID 123."

1. The frontend gets the proof (π), public inputs (user ID, record ID 123), and the `vk` from the blockchain.
2. It uses the ZK-SNARK library's verification function: `verify(vk, public_inputs, π)`.
3. If `verify()` returns `true`, the user is authenticated; if `false`, they are not.  The user's key (the witness) remains secret.


The verification process is computationally less intensive than proof generation, but it's still important to ensure its efficiency and security.  The choice of the ZK-SNARK scheme influences both the generation and verification complexity.  Schemes like PlonK are optimized for faster verification compared to Groth16, for example.
