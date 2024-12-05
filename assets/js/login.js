document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let user = document.getElementById('input-user').value;
    let password = document.getElementById('input-password').value;
    

    const headers = {
        "X-Parse-Application-Id": "ypYcXausTPunhXtj7Qz2KdO7JDp3wjLjtcXv5hTj",
        "X-Parse-REST-API-Key": "17jeZZW0H22bYIA3MZrii1q9Qd2Sz0BEjOcPiC57",
        "X-Parse-Revocable-Session": "1",
    };

    const body = {
        "username": user,
        "password": password
    };

    try {
        const login = await fetch('https://parseapi.back4app.com/login', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (login.ok) {
            const loginJson = await login.json();
            localStorage.setItem('token', loginJson.sessionToken);
            return window.location.href = '/';
        }
        
        document.getElementById('error').style.opacity = '1';
        setInterval(() => {
            document.getElementById('error').style.opacity = '0';
        }, 6000)

    } catch (error) {
        console.log(error);
    }
})
