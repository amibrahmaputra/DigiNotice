import { useNavigate } from 'react-router-dom';

export default function RoleRegistrationPage() {
	const navigate = useNavigate();

	function goToSignup(role) {
		// navigate to signup and pass selected role as query param
		console.log('Navigating to signup with role:', role); // Debug log
		navigate(`/signup?role=${encodeURIComponent(role)}`);
	}

	return (
		<div style={{
			minHeight: '100vh',
			backgroundImage: 'url(/tezpur-campus.jpg)',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundAttachment: 'fixed',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			backgroundBlendMode: 'darken',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '20px'
		}}>
			<div className="card panel" style={{ maxWidth: 520, width: '100%', textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
				<div className="section-title">Create Account</div>
				<div className="muted" style={{ marginBottom: 24, fontSize: 14 }}>Choose your role to continue</div>
				
				<div style={{ 
					display: 'flex', 
					flexDirection: 'column', 
					gap: 12, 
					marginTop: 16,
					padding: 20,
					border: '1px solid #ddd',
					borderRadius: '8px',
					backgroundColor: '#f9f9f9'
				}}>
					<div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#333' }}>Register as</div>
					<button 
						className="btn primary" 
						onClick={() => goToSignup('student')}
						style={{ width: '100%' }}
					>
						👨‍🎓 Student
					</button>
					<button 
						className="btn primary" 
						onClick={() => goToSignup('teacher')}
						style={{ width: '100%' }}
					>
						👨‍🏫 Teacher
					</button>
					<button 
						className="btn primary" 
						onClick={() => goToSignup('admin')}
						style={{ width: '100%' }}
					>
						👨‍💼 Admin
					</button>
				</div>
				
				<div className="muted" style={{ marginTop: 20, fontSize: 13 }}>
					If you already have an account, you can <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>login here</a>.
				</div>
			</div>
		</div>
	);
}
