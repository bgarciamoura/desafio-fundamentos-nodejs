import Transaction from '../models/Transaction';

interface Balance {
	income: number;
	outcome: number;
	total: number;
}

interface CreateTransactionDTO {
	title: string;
	value: number;
	type: 'income' | 'outcome';
}

class TransactionsRepository {
	private transactions: Transaction[];

	constructor() {
		this.transactions = [];
	}

	public all(): Transaction[] {
		return this.transactions;
	}

	public getBalance(): Balance {
		// const income = this.transactions.reduce((acc, transaction) => {
		// 	return transaction.type === 'income'
		// 		? acc + transaction.value
		// 		: acc + 0;
		// }, 0);

		// const outcome = this.transactions.reduce((acc, transaction) => {
		// 	return transaction.type === 'outcome'
		// 		? acc + transaction.value
		// 		: acc + 0;
		// }, 0);

		const { income, outcome } = this.transactions.reduce(
			(accumulator: Balance, transaction: Transaction) => {
				if (transaction.type === 'outcome') {
					accumulator.outcome += transaction.value;
				} else {
					accumulator.income += transaction.value;
				}
				return accumulator;
			},
			{
				income: 0,
				outcome: 0,
				total: 0,
			},
		);

		const balance = {
			income,
			outcome,
			total: income - outcome,
		};

		return balance;
	}

	public create({ title, value, type }: CreateTransactionDTO): Transaction {
		const { total } = this.getBalance();

		if (type === 'outcome' && value > total) {
			throw new Error('Outcome must be lesser than total.');
		}

		const transaction = new Transaction({
			title,
			value,
			type,
		});

		this.transactions.push(transaction);

		return transaction;
	}
}

export default TransactionsRepository;
