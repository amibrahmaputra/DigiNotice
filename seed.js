import bcrypt from 'bcryptjs';
import { all, get, run } from './db.js';

const demoUsers = [
	{ name: 'Admin User', email: 'admin@tezpuruniversity.ac.in', role: 'admin', department: 'General', password: 'Admin@123' },
	{ name: 'Teacher One', email: 'teacher@tezpuruniversity.ac.in', role: 'teacher', department: 'CS', password: 'Teacher@123' },
	{ name: 'Student One', email: 'student@tezpuruniversity.ac.in', role: 'student', department: 'CS', password: 'Student@123' }
];

export async function seedDemo() {
	try {
		const existing = await all('SELECT email FROM users');
		const existingEmails = new Set(existing.map(u => u.email));
		for (const user of demoUsers) {
			if (existingEmails.has(user.email)) {
				console.log(`User ${user.email} already exists, skipping`);
				continue;
			}
			const passwordHash = await bcrypt.hash(user.password, 10);
			await run(
				'INSERT INTO users (name, email, password_hash, role, department) VALUES (?,?,?,?,?)',
				[user.name, user.email, passwordHash, user.role, user.department]
			);
			console.log(`Created user: ${user.email} (${user.role})`);
		}
	} catch (err) {
		console.error('Error seeding users:', err);
		throw err;
	}
	const noticeCountRow = await get('SELECT COUNT(*) as c FROM notices');
	if (!noticeCountRow || noticeCountRow.c === 0) {
		const now = new Date().toISOString();
		const teacher = await get('SELECT id FROM users WHERE role = ?', ['teacher']);
		await run(
			'INSERT INTO notices (title, content, category, department, author_id, approved, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)',
			[
				'Welcome Back to Campus',
				'Classes resume from next Monday. Please check your schedules.',
				'Academic',
				'all',
				teacher?.id ?? 2,
				1,
				now,
				now
			]
		);
		await run(
			'INSERT INTO notices (title, content, category, department, author_id, approved, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)',
			[
				'CS Department Hackathon',
				'24-hour coding marathon this weekend. Teams of 3-4. Register online.',
				'Events',
				'all',
				teacher?.id ?? 2,
				1,
				now,
				now
			]
		);
	}
}


