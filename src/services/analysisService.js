import { MarkerType } from 'reactflow';

/**
 * Analyzes an image using OpenAI's GPT-4o to generate a Mermaid diagram.
 * @param {File} imageFile 
 * @returns {Promise<string>} Mermaid diagram string
 */
export const generateMermaidFromImage = async (imageFile) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (apiKey) {
        console.log("analysisService: Using OpenAI API for Mermaid generation");
        return generateMermaidWithOpenAI(imageFile, apiKey);
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
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (apiKey) {
        console.log("analysisService: Using OpenAI API for Flow conversion");
        return convertToFlowWithOpenAI(mermaidCode, apiKey);
    } else {
        console.log("analysisService: No API key found, using mock data");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getMockGraph());
            }, 1500);
        });
    }
};

const generateMermaidWithOpenAI = async (file, apiKey) => {
    try {
        const base64Image = await toBase64(file);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a system architecture expert. Analyze the provided system design diagram image and convert it into a Mermaid JS diagram.
            
            Return ONLY the Mermaid code string. Do not include markdown code blocks (like \`\`\`mermaid).
            
            Rules:
            1. Use 'graph TD' or 'graph LR' based on the layout.
            2. Use appropriate shapes for components (cylinder for databases, rect for servers, etc).
            3. Ensure directionality of arrows matches the image.`
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Convert this system design to Mermaid." },
                            { type: "image_url", image_url: { url: base64Image } }
                        ]
                    }
                ],
                max_tokens: 4000
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        let content = data.choices[0].message.content;
        // Clean up markdown code blocks if present
        content = content.replace(/^```mermaid\n/, '').replace(/^```\n/, '').replace(/```$/, '');
        return content.trim();

    } catch (error) {
        console.error("OpenAI API Error:", error);
        alert("Failed to analyze image with AI. Falling back to mock data.");
        return getMockMermaid();
    }
};

const convertToFlowWithOpenAI = async (mermaidCode, apiKey) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a system architecture expert. Convert the provided Mermaid diagram code into a structured graph format for React Flow.
            
            Return ONLY a valid JSON object (no markdown formatting) with this structure:
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
            3. Ensure all source and target IDs in edges exist in the nodes array.`
                    },
                    {
                        role: "user",
                        content: `Convert this Mermaid code to React Flow JSON:\n\n${mermaidCode}`
                    }
                ],
                max_tokens: 4000,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const result = JSON.parse(data.choices[0].message.content);
        return result;

    } catch (error) {
        console.error("OpenAI API Error:", error);
        alert("Failed to convert Mermaid to Flow. Falling back to mock data.");
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
