import { Request, Response, Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request: Request, response: Response) => {
	try {
		const transactions = transactionsRepository.all();
		const balance = transactionsRepository.getBalance();
		return response.status(200).json({ transactions, balance });
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

transactionRouter.post('/', (request: Request, response: Response) => {
	try {
		const { title, value, type } = request.body;

		const CreateTransaction = new CreateTransactionService(
			transactionsRepository,
		);

		const transaction = CreateTransaction.execute({
			title,
			value,
			type,
		});

		return response.status(200).json(transaction);
	} catch (err) {
		return response.status(400).json({ error: err.message });
	}
});

export default transactionRouter;
