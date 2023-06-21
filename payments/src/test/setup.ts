import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import * as jwt from 'jsonwebtoken'

declare global {
	var signin: (id?:string) => string[];
}

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51NL0QELMUs94LBR0VpeDby3GXr1yQQTypyQq0jY4dIeeRif26TbvlVD9tZduWCPCKDF2N1rRQqBx5auiezy4OAQe005QWQdpbi';

let mongo: any;

beforeAll(async () => {
	process.env.JWT_KEY = 'asdfasdf';
	
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	
	await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();
	
	for (let collection of collections) {
		await collection.deleteMany();
	}
});

afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});

global.signin = (id?: string) => {
	// build a JWT payload { id, email }
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com'
	};
	
	// create the JWT.
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	
	// build session obj { jwt: MY_JWT }
	const session = { jwt: token };
	
	// turn it into JSON
	const sessionJSON = JSON.stringify(session);
	
	// encode it as base64
	const base64 = Buffer.from(sessionJSON).toString('base64');
	
	// return a string thats the cookie with encoded data.
	return [`session=${base64}`];
}