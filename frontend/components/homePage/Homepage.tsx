import { useState } from 'react';

const ZKComponent = () => {
    const [proof, setProof] = useState(null);
    const [isValid, setIsValid] = useState(null);

    const generateProof = async () => {
        try {
            const response = await fetch('http://localhost:4001/zk-snark/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: 42 }),
            });
            const result = await response.json();
            setProof(result);
        } catch (error) {
            console.error('Proof generation error:', error);
        }
    };

    const verifyProof = async () => {
        if (!proof) return alert('Generate proof first');
        try {
            const response = await fetch('http://localhost:4001/zk-snark/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proof),
            });
            const result = await response.json();
            console.log('Proof sent:', JSON.stringify(proof));
            console.log('Public Input sent:', JSON.stringify(proof.public_input));
            setIsValid(result);
        } catch (error) {
            console.error('Proof verification error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">ZK-SNARK Example</h1>
            <p className="mb-4">Generate and verify a zero-knowledge proof.</p>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={generateProof}>Generate Proof</button>
            <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800" onClick={verifyProof}>Verify Proof</button>
            {proof && <div>Proof: {JSON.stringify(proof)}</div>}
            {isValid !== null && <div>Verification: {isValid ? 'Valid' : 'Invalid'}</div>}
        </div>
    );
};

export default ZKComponent;