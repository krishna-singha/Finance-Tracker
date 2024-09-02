const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const handleGenerateText = async (req, res) => {
    const { userPrompt, data } = req.body;

    try {
        const prompt = `
            Here is the transaction data of a user:
            ${data.map((ele, index) => {
                return (`
                    **Transaction ${index + 1}:**
                    - **Date:** ${ele.date}
                    - **Type:** ${ele.type}
                    - **${ele.type === "stock" ? "Stock Name" : "Source"}:** ${ele.name}
                    ${ele.type === "expense" ? `- **Category:** ${ele.category}` : ''}
                    - **${ele.type === "stock" && ele.status === "hold"
                    ? "Invested Amount"
                    : ele.type === "stock" && ele.status === "sold"
                        ? "Sold Amount"
                        : "Amount"}:** ${ele.amount}
                    ${ele.type === "stock" ? `- **Quantity:** ${ele.quantity}` : ''}
                `);
            })}

            Here is the user prompt:
            ${userPrompt}

            Here is the response type:
            If the user's prompt is related to finance generate financial advice or respond directly to the user's query using the transaction data provided above.
            Otherwise, respond only: "I can assist you with financial-related queries only."

            Here is the instruction for the response:
            Ensure the response is formatted clearly in Markdown with bullet points, headings, and  <br><br> for spacing between sections, headings, transection etc, anything which need 1 line gap to enhance readability dont use black space for gap.
            Starts points or suggestion with two <br> tags.

            Here is the response format you can use:
            1. **Suggestion 1:** <br>
            - [Description] <br>
            <br>
            - **Suggestion 2:** <br>
            * [Description] <br>
            <br>
            Feel free to add more suggestions as needed.
        `;

        const result = await model.generateContent(prompt);
        return res.status(200).json({ suggestion: result.response.text() });
    } catch (error) {
        console.error("Error generating suggestion:", error);
        res.status(500).json({ error: "Failed to generate suggestion" });
    }
};

module.exports = {
    handleGenerateText,
};
