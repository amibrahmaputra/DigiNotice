import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const navigate = useNavigate();

	const containerStyle = {
		maxWidth: 420,
		margin: '24px auto',
		padding: 28,
		borderRadius: 20,
		background: 'linear-gradient(180deg, #ffffff, #fbfdff)',
		boxShadow: '0 20px 40px rgba(18,24,49,0.08)'
	};

	const heroImgStyle = {
		display: 'block',
		margin: '0 auto 18px',
		width: 160,
		height: 160
	};

	const bigButton = {
		width: '100%',
		padding: '16px 20px',
		borderRadius: 16,
		border: 'none',
		color: 'white',
		fontWeight: 600,
		fontSize: 16,
		background: 'linear-gradient(90deg,#6b5bff,#5ec7ff)',
		boxShadow: '0 10px 24px rgba(94,199,255,0.18)'
	};

	const socialBtn = {
		width: '100%',
		padding: '12px 14px',
		borderRadius: 12,
		border: '1px solid #e6edf3',
		background: '#fff',
		display: 'flex',
		alignItems: 'center',
		gap: 12,
		cursor: 'pointer'
	};

	return (
		<div style={{ padding: 12 }}>
			<div style={containerStyle}>
				<div style={{ textAlign: 'center' }}>
					<svg style={heroImgStyle} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<linearGradient id="g1" x1="0" x2="1">
								<stop offset="0" stopColor="#6b5bff" />
								<stop offset="1" stopColor="#5ec7ff" />
							</linearGradient>
						</defs>
						<rect x="0" y="0" width="200" height="200" rx="24" fill="url(#g1)" opacity="0.04" />
						<g transform="translate(40,30)">
							<ellipse cx="60" cy="90" rx="52" ry="36" fill="#ecfeff" />
							<rect x="24" y="10" width="72" height="72" rx="20" fill="#c7f8ff" />
							<rect x="32" y="18" width="56" height="48" rx="12" fill="#fff" />
							<circle cx="50" cy="40" r="6" fill="#111827" />
							<circle cx="74" cy="40" r="6" fill="#111827" />
							<rect x="44" y="52" width="24" height="6" rx="3" fill="#111827" opacity="0.9" />
						</g>
					</svg>
					<h2 style={{ margin: '6px 0 6px', fontSize: 22 }}>Let’s Get Started</h2>
					<div className="muted" style={{ marginBottom: 18 }}>All your campus news — organized, fast, and always on time.</div>
				</div>

				<div style={{ marginTop: 8 }}>
					<button style={bigButton} onClick={() => navigate('/login')}> 
						SIGN IN <span style={{ marginLeft: 8 }}>→</span>
					</button>
				</div>

				<div style={{ textAlign: 'center', margin: '14px 0', color: '#9aa6b2' }}>OR</div>

				<div>
					<button style={socialBtn} onClick={() => window.location.href = '/api/auth/google'}>
						<img src="https://www.gstatic.com/devrel-devsite/prod/vf9a2ed1b89bb0f3f3b2b5b7cbf1f3c3b2a0f8f3ec2a1a8d1b5e2d0f6a8a4e5b/google.svg" alt="Google" style={{ width: 20 }} onError={(e) => { e.target.style.display = 'none'; }} />
						<div style={{ flex: 1, textAlign: 'left' }}>Login with Google</div>
					</button>
				</div>

				<div style={{ marginTop: 18, textAlign: 'center', fontSize: 14 }}>
					Don't have an account? <a href="/signup" style={{ color: '#4f46e5', fontWeight: 600 }}>Sign up</a>
				</div>
			</div>
		</div>
	);
}


