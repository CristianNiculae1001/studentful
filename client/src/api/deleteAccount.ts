export const deleteAccount = async () => {
    const DELETE_ACCOUNT_URL = 'http://localhost:5000/api/v1/delete-account';
    const response = await fetch(DELETE_ACCOUNT_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth')}`,
        },
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    return data;
}