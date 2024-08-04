const LastFiveTransection = () => {
    // const { transactions } = useContext(GlobalContext);
    const transactions = [
        { id: 1, text: 'Flower', amount: -20 },
        { id: 2, text: 'Salary', amount: 300 },
        { id: 3, text: 'Book', amount: -10 },
        { id: 4, text: 'Camera', amount: -150 },
        { id: 5, text: 'Phone', amount: 200 },
    ];

    return (
        <div className="text-white">
            <h3>Last Five Transactions</h3>
            <ul>
                {transactions.slice(0, 5).map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.text} <span>{transaction.amount}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LastFiveTransection;