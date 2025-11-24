import { useEffect, useMemo, useState } from 'react';
import { apiDelete, apiGet, apiPost, apiPostFormData, apiPut } from '../lib/api.js';
import { downloadFile } from '../lib/fileUtil.js';

const CATEGORIES = ['Academic','Exam','Events','Hostel','Placement','General'];
const DEPARTMENTS = ['all','CS','Mechanical','Civil','Electrical'];

function NoticeForm({ initial, onSave }) {
	const [title, setTitle] = useState(initial?.title ?? '');
	const [content, setContent] = useState(initial?.content ?? '');
	const [category, setCategory] = useState(initial?.category ?? 'General');
	const [department, setDepartment] = useState(initial?.department ?? 'all');
	const [commentEnabled, setCommentEnabled] = useState(initial?.comment_enabled !== undefined ? initial.comment_enabled : true);
	const [files, setFiles] = useState([]);
	const [fileInput, setFileInput] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	async function submit(e) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			if (initial?.id) {
				const updated = await apiPut(`/notices/${initial.id}`, { title, content, category, department, comment_enabled: commentEnabled });
				onSave(updated);
				alert('Notice updated successfully!');
			} else {
				const formData = new FormData();
				formData.append('title', title);
				formData.append('content', content);
				formData.append('category', category);
				formData.append('department', department);
				formData.append('comment_enabled', commentEnabled);
				files.forEach(file => formData.append('files', file));
				const created = await apiPostFormData('/notices', formData);
				onSave(created);
				alert('Notice published successfully!');
				setTitle(''); setContent(''); setCategory('General'); setDepartment('all');
				setCommentEnabled(true); setFiles([]);
				if (fileInput) fileInput.value = '';
			}
		} catch (err) {
			console.error('Submit error:', err);
			setError(err.message || 'Failed to save notice');
		} finally {
			setLoading(false);
		}
	}
	return (
		<form onSubmit={submit} className="card panel" style={{ gridColumn: 'span 12' }}>
			<div className="section-title">{initial?.id ? 'Edit Notice' : 'Create Notice'}</div>
			<div className="spacer" />
			<div className="row">
				<input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
			</div>
			<div className="spacer" />
			<textarea className="textarea" rows={5} placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} />
			<div className="spacer" />
			<div className="row">
				<select className="select" value={category} onChange={e=>setCategory(e.target.value)}>
					{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
				</select>
				<select className="select" value={department} onChange={e=>setDepartment(e.target.value)}>
					{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
				</select>
			</div>
			<div className="spacer" />
			{!initial?.id && (
				<>
					<div className="row">
						<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" ref={setFileInput}
								onChange={e => setFiles(Array.from(e.target.files))} style={{ display: 'none' }} />
							<button type="button" className="btn" onClick={() => fileInput?.click()}>
								📎 Upload Files/Photos
							</button>
							{files.length > 0 && <span className="muted">({files.length} file{files.length > 1 ? 's' : ''})</span>}
						</label>
					</div>
					{files.length > 0 && (
						<div style={{ marginTop: 8, fontSize: 14 }}>
							{files.map((f, i) => (
								<div key={i} className="muted" style={{ marginTop: 4 }}>
									{f.name} ({(f.size / 1024).toFixed(1)} KB)
								</div>
							))}
						</div>
					)}
					<div className="spacer" />
				</>
			)}
			<div className="row">
				<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<input type="checkbox" checked={commentEnabled} onChange={e => setCommentEnabled(e.target.checked)} />
					<span>Enable Comments</span>
				</label>
			</div>
			<div className="spacer" />
			<div className="row">
				<button className="btn primary" type="submit" disabled={loading}>{loading ? '...' : initial?.id ? 'Update' : 'Publish'}</button>
			</div>
			{error && <div style={{ marginTop: 8, color: '#d32f2f', fontWeight: 500 }}>{error}</div>}
			<div className="muted" style={{ marginTop: 8 }}>
				Notices by teachers require admin approval before appearing publicly.
			</div>
		</form>
	);
}

function RowActions({ notice, canApprove, onApprove, onEdit, onDelete }) {
	return (
		<div className="row">
			<button className="btn" onClick={() => onEdit(notice)}>Edit</button>
			<button className="btn" onClick={() => onDelete(notice)}>Delete</button>
			{canApprove && !notice.approved && (
				<button className="btn primary" onClick={() => onApprove(notice)}>Approve</button>
			)}
		</div>
	);
}

export default function DashboardPage({ user }) {
	const [items, setItems] = useState([]);
	const [editing, setEditing] = useState(null);
	const isAdmin = user.role === 'admin';
	useEffect(() => {
		apiGet('/notices', { approved: isAdmin ? undefined : undefined, pageSize: 50 })
			.then(d => setItems(d.items))
			.catch(()=>{});
	}, [isAdmin]);
	async function handleSave(updatedOrCreated) {
		setEditing(null);
		setItems(prev => {
			const idx = prev.findIndex(i => i.id === updatedOrCreated.id);
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = updatedOrCreated;
				return next;
			}
			return [updatedOrCreated, ...prev];
		});
	}
	async function handleApprove(n) {
		try {
			const upd = await apiPost(`/notices/${n.id}/approve`);
			setItems(prev => prev.map(i => i.id === n.id ? upd : i));
			alert('Notice approved successfully!');
		} catch (err) {
			console.error('Approve error:', err);
			alert('Error approving notice: ' + err.message);
		}
	}
	async function handleDelete(n) {
		if (!confirm('Delete this notice?')) return;
		try {
			await apiDelete(`/notices/${n.id}`);
			setItems(prev => prev.filter(i => i.id !== n.id));
			alert('Notice deleted successfully!');
		} catch (err) {
			console.error('Delete error:', err);
			alert('Error deleting notice: ' + err.message);
		}
	}
	return (
		<div className="grid" style={{ marginTop: 16 }}>
			<NoticeForm initial={editing} onSave={handleSave} />
			<div className="card panel" style={{ gridColumn: 'span 12' }}>
				<div className="section-title">Your Notices</div>
				<div className="spacer" />
				<div className="grid">
					{items.map(n => {
						// Separate images and files
						const images = n.attachments?.filter(a => a.file_type?.startsWith('image/')) || [];
						const files = n.attachments?.filter(a => !a.file_type?.startsWith('image/')) || [];
						
						return (
							<div key={n.id} className="card panel" style={{ gridColumn: 'span 12', overflow: 'hidden' }}>
								{/* Show images prominently at top */}
								{images.length > 0 && (
									<div style={{ marginLeft: -16, marginRight: -16, marginTop: -16, marginBottom: 12 }}>
										{images.map(img => (
											<div key={img.id} style={{ overflow: 'hidden', borderRadius: '4px 4px 0 0' }}>
												<img 
													src={img.url} 
													alt={img.original_filename} 
													loading="lazy"
													style={{ 
														width: '100%', 
														height: 'auto',
														minHeight: 150,
														maxHeight: 300,
														objectFit: 'cover',
														display: 'block'
													}} 
													onError={(e) => {
														e.target.src = `/api/notices/files/${img.filename}`;
													}}
												/>
											</div>
										))}
									</div>
								)}
								
								<div className="row" style={{ justifyContent: 'space-between' }}>
									<div style={{ fontWeight: 600, fontSize: 16 }}>{n.title}</div>
									<div className="row">
										<div className="badge blue">{n.category}</div>
										<div className="badge cyan">{n.department}</div>
									</div>
								</div>
								<div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
									{new Date(n.created_at).toLocaleString()} • {n.approved ? '✓ Approved' : '⏳ Pending'}
								</div>
								
								<div style={{ marginTop: 12, marginBottom: 12, lineHeight: 1.5 }}>
									{n.content.slice(0, 200)}{n.content.length > 200 ? '…' : ''}
								</div>
								
								{/* Show other files */}
								{files.length > 0 && (
									<div style={{ marginBottom: 12, padding: '8px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
										{files.map(file => (
											<div key={file.id} style={{ marginBottom: 6 }}>
												<button 
													onClick={() => downloadFile(file.filename, file.original_filename)}
													className="btn" 
													style={{ fontSize: 12, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', color: 'inherit' }}
												>
													📎 {file.original_filename}
												</button>
											</div>
										))}
									</div>
								)}
								
								<div className="spacer" />
								<RowActions
									notice={n}
									canApprove={isAdmin}
									onApprove={handleApprove}
									onEdit={setEditing}
									onDelete={handleDelete}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}


