import request from 'supertest';
import { app } from '../../app';


it('responds with details about the current user', async () => {
	const cookie = await global.signin();
	
	// const authRes = await request(app)
	// 	.post('/api/users/signup')
	// 	.send({
	// 		email: 'test@test.com',
	// 		password: 'password'
	// 	})
	// 	.expect(201);
	// const cookie = authRes.get('Set-Cookie');
		
	const res = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(400);
		// .expect(200);
		
	expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
	const res = await request(app)
		.get('/api/users/currentuser')
		.send()
		.expect(200);
		
		expect(res.body.currentUser).toEqual(null);
});