import { EDITOR_URL } from '../utils/urls';

export const getEditorList = async () => {
	const response = await fetch(EDITOR_URL, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('auth')}`,
		},
	});
	const data = await response.json();
	return data;
};
