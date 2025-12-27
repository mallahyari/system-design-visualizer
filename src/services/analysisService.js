import { GoogleGenerativeAI } from '@google/generative-ai';
import { MarkerType } from 'reactflow';

/**
 * Analyzes an image using Google's Gemini to generate a Mermaid diagram.
 * @param {File} imageFile 
 * @returns {Promise<string>} Mermaid diagram string
 */
export const generateMermaidFromImage = async (imageFile) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
        console.log("analysisService: Using Gemini API for Mermaid generation");
        return generateMermaidWithGemini(imageFile, apiKey);
    } else {
        console.log("analysisService: No API key found, using mock data");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getMockMermaid());
            }, 1500);
        });
    }
};

/**
 * Converts a Mermaid diagram string to React Flow nodes and edges.
 * @param {string} mermaidCode 
 * @returns {Promise<{nodes: Array, edges: Array}>}
 */
export const convertMermaidToFlow = async (mermaidCode) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
        console.log("analysisService: Using Gemini API for Flow conversion");
        return convertToFlowWithGemini(mermaidCode, apiKey);
    } else {
        console.log("analysisService: No API key found, using mock data");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getMockGraph());
            }, 1500);
        });
    }
};

const generateMermaidWithGemini = async (file, apiKey) => {
    try {
        console.log("Initializing Gemini API with key:", apiKey ? "Key present" : "No key");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        // Convert file to base64
        const base64Data = await toBase64(file);
        // Remove the data URL prefix to get just the base64 string
        const base64Image = base64Data.split(',')[1];
        const mimeType = file.type;

        console.log("Sending request to Gemini API...");
        console.log("File type:", mimeType);

        const prompt = `You are a system architecture expert. Analyze the provided system design diagram image and convert it into a Mermaid JS diagram.

Return ONLY the Mermaid code string. Do not include markdown code blocks (like \`\`\`mermaid).

Rules:
1. Use 'graph TD' or 'graph LR' based on the layout.
2. Use appropriate shapes for components (cylinder for databases, rect for servers, etc).
3. Ensure directionality of arrows matches the image.

Convert this system design to Mermaid.`;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            },
            { text: prompt }
        ]);

        const response = result.response;
        let content = response.text();
        
        console.log("Received response from Gemini API");
        
        // Clean up markdown code blocks if present
        content = content.replace(/^```mermaid\n/, '').replace(/^```\n/, '').replace(/```$/m, '');
        return content.trim();

    } catch (error) {
        console.error("Gemini API Error Details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        const errorMsg = `Failed to analyze image with AI: ${error.message || 'Unknown error'}. Falling back to mock data.`;
        alert(errorMsg);
        return getMockMermaid();
    }
};

const convertToFlowWithGemini = async (mermaidCode, apiKey) => {
    try {
        console.log("Initializing Gemini API for Flow conversion");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3-flash-preview",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const prompt = `You are a system architecture expert. Convert the provided Mermaid diagram code into a structured graph format for React Flow.

Return ONLY a valid JSON object with this structure:
{
  "nodes": [
    { 
      "id": "string", 
      "type": "one of: clientNode, serverNode, databaseNode, loadBalancerNode, cacheNode", 
      "position": { "x": number, "y": number }, 
      "data": { 
        "label": "string", 
        "description": "brief description of role inferred from context", 
        "tech": "inferred technologies" 
      } 
    }
  ],
  "edges": [
    { "id": "string", "source": "nodeId", "target": "nodeId", "animated": true, "label": "optional connection label" }
  ]
}

Rules:
1. Map Mermaid shapes/names to the most appropriate node type.
2. Space out the position coordinates (x, y) so the graph is readable.
3. Ensure all source and target IDs in edges exist in the nodes array.

Convert this Mermaid code to React Flow JSON:

${mermaidCode}`;

        console.log("Sending Mermaid conversion request to Gemini API...");
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        console.log("Received response from Gemini API");
        const jsonData = JSON.parse(text);
        return jsonData;

    } catch (error) {
        console.error("Gemini API Error Details:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        const errorMsg = `Failed to convert Mermaid to Flow: ${error.message || 'Unknown error'}. Falling back to mock data.`;
        alert(errorMsg);
        return getMockGraph();
    }
};

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const getMockMermaid = () => {
    return `graph TD
    Client[Client / Browser] -->|HTTPS| LB[Load Balancer]
    LB --> Web1[Web Server 1]
    LB --> Web2[Web Server 2]
    Web1 --> DB[(Primary Database)]
    Web2 --> DB
    Web1 -.-> Cache[(Redis Cache)]`;
};

const getMockGraph = () => {
    // This is a hardcoded "standard" 3-tier architecture for demo purposes
    const nodes = [
        {
            id: 'client',
            type: 'clientNode',
            position: { x: 250, y: 0 },
            data: {
                label: 'Client / Browser',
                description: 'The user interface running in the browser. Sends requests to the Load Balancer.',
                tech: 'React, Mobile App'
            },
        },
        {
            id: 'lb',
            type: 'loadBalancerNode',
            position: { x: 250, y: 150 },
            data: {
                label: 'Load Balancer',
                description: 'Distributes incoming network traffic across multiple servers to ensure reliability and performance.',
                tech: 'NGINX, AWS ALB'
            },
        },
        {
            id: 'web-server-1',
            type: 'serverNode',
            position: { x: 100, y: 300 },
            data: {
                label: 'Web Server 1',
                description: 'Handles application logic and processes user requests.',
                tech: 'Node.js, Express'
            },
        },
        {
            id: 'web-server-2',
            type: 'serverNode',
            position: { x: 400, y: 300 },
            data: {
                label: 'Web Server 2',
                description: 'Secondary server for horizontal scaling and high availability.',
                tech: 'Node.js, Express'
            },
        },
        {
            id: 'db-primary',
            type: 'databaseNode',
            position: { x: 250, y: 450 },
            data: {
                label: 'Primary Database',
                description: 'Stores persistent data. Handles write operations.',
                tech: 'PostgreSQL, MongoDB'
            },
        },
        {
            id: 'cache',
            type: 'cacheNode',
            position: { x: 50, y: 450 },
            data: {
                label: 'Redis Cache',
                description: 'Stores frequently accessed data to reduce database load.',
                tech: 'Redis'
            },
        },
    ];

    const edges = [
        { id: 'e1', source: 'client', target: 'lb', animated: true, label: 'HTTPS' },
        { id: 'e2', source: 'lb', target: 'web-server-1', animated: true },
        { id: 'e3', source: 'lb', target: 'web-server-2', animated: true },
        { id: 'e4', source: 'web-server-1', target: 'db-primary', animated: true },
        { id: 'e5', source: 'web-server-2', target: 'db-primary', animated: true },
        { id: 'e6', source: 'web-server-1', target: 'cache', type: 'smoothstep', style: { strokeDasharray: '5,5' } },
    ];

    return { nodes, edges };
};
