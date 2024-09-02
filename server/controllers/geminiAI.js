const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const handleGenerateText = async (req, res) => {
    const { userPrompt, data } = req.body;

    // const data = [
    //     { date: "2024-09-03", name: "Tata", amount: 10000, quantity: 7, type: "stock", status: "hold" },
    //     { date: "2024-09-02", name: "Scholarship", amount: 20000, type: "income" },
    //     { date: "2024-09-02", name: "console", amount: 40000, type: "expense" },
    //     { date: "2024-09-02", name: "apple", amount: 200, quantity: 1, type: "stock", status: "sold" },
    //     { date: "2024-08-30", name: "freelance", amount: 1000, type: "income" },
    //     { date: "2024-08-30", name: "Mobile", amount: 4000, type: "expense" },
    //     { date: "2024-08-23", name: "Digha", amount: 2000, type: "expense" },
    //     { date: "2024-08-22", name: "apple", amount: 1000, quantity: 3, type: "stock", status: "hold" },
    //     { date: "2024-08-16", name: "google", amount: 1200, quantity: 1, type: "stock", status: "hold" },
    //     { date: "2024-08-15", name: "Netflix", amount: 12000, quantity: 5, type: "stock", status: "hold" },
    //     { date: "2024-08-13", name: "Scholarship", amount: 15000, type: "income" },
    //     { date: "2024-07-11", name: "One 97 Communications Ltd", amount: 403, quantity: 1, type: "stock", status: "hold" }
    // ];

    try {
        const prompt = `
            Here is the data of the particular user transactions:
            ${data.map((ele, index) => {
            return (
                `   
                    Transection ${index + 1}
                    Date: ${ele.date}, 
                    Type: ${ele.type},
                    ${ele.type === "stock" ? "Stock Name" : "Source"}: ${ele.name}, 
                    ${ele.type === "expense" ? `Category: ${ele.category}` : ''}, 
                    ${ele.type == "stock" && ele.status == "hold"
                    ? "Invested amount"
                    : ele.type == "stock" && ele.status == "sold"
                        ? "Sold amount"
                        : "Amount"}: ${ele.amount}, 
                    ${ele.type === "stock" ? `Quantity: ${ele.quantity}` : ''}
                `
            );
        }).join("\n")}
            
            User propmt is: ${userPrompt}

            If user asking for financial advice then,
            Use user prompt and the transaction data to generate a financial advice for the user.

            Other than that, simply generate that I can assist you with only financial related queries.

            Make sure to format the response clearly in markdown with bullet points, headings, with <br> tag for more good lookin ui or other relevant formatting to enhance readability.
            
            Here's the format you can follow:
            <br>
            **Suggestion 1:** [Description]
            <br>
            **Suggestion 2:** [Description]
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
