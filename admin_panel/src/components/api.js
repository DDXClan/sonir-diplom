export const RefreshToken = () => {
    fetch('http://127.0.0.1:8000/auth/refresh', {
        method: 'PATCH', 
        body: JSON.stringify({'refresh_token': localStorage.getItem('refresh_token')}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            sessionStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.reload();
            throw new Error('Failed to refresh token');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token' , data.refresh_token);
    })
    .catch(error => console.log('There was an error refreshing the token:', error));
}