<script>
    import { userStore, isLoggedIn, authToken } from '../../store.js';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let newUsername = '';
    let newEmail = '';
    let oldPassword = '';
    let newPassword = '';

    // Felhasználói adatok figyelése
    let isUserLoggedIn;
    $: isUserLoggedIn = $isLoggedIn;
    $: userName = $userStore.userName || '';
    $: email = $userStore.email || '';
    $: firstName = $userStore.firstName || '';
    $: lastName = $userStore.lastName || '';

    // Az authToken store-ból kinyerjük a token-t
    let token = $authToken.token;  // Itt már az authToken store értékét használjuk

    onMount(() => {
        if (browser) {
            // Ha van token a localStorage-ban, beállítjuk a store értékét
            const authTokenFromStorage = localStorage.getItem("authToken");
            if (authTokenFromStorage) {
                const parsedToken = JSON.parse(authTokenFromStorage);
                token = parsedToken.token;
                console.log('Token sikeresen betöltve:', token);
            } else {
                console.log('Token nem található a localStorage-ban');
            }
        }
    });

    // Módosítási függvények
    const updateUsername = async () => {
    // Ellenőrizzük, hogy van érvényes token
    if (!token) {
        alert('Nincs bejelentkezve. Kérlek jelentkezz be!');
        return;
    }

    const response = await fetch('https://localhost:7214/api/Account/update-username', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // A token a "Bearer" prefix-szel
        },
        body: JSON.stringify({ newUsername })
    });

    try {
        const textResponse = await response.text();  // Válasz szöveges formátumban

        if (response.ok) {
            // Frissítjük a store-t és localStorage-t
            $userStore.userName = newUsername;
            localStorage.setItem('user', JSON.stringify($userStore));
            alert(textResponse);  // A szerver szöveges válaszát megjelenítjük

            // Inputok törlése a sikeres módosítás után
            newUsername = '';  // Ürítjük az input mezőt
        } else {
            alert(`Hiba történt a felhasználónév módosítása közben: ${textResponse}`);
        }
    } catch (error) {
        console.error('Hiba történt:', error);
        alert('Hiba történt a felhasználónév módosítása közben, kérlek próbáld újra.');
    }
};



const updateEmail = async () => {
    const response = await fetch('https://localhost:7214/api/Account/update-email', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail })
    });

    try {
        const textResponse = await response.text();  // Válasz szöveges formátumban

        if (response.ok) {
            // Frissítjük a store-t és localStorage-t
            $userStore.email = newEmail;
            localStorage.setItem('user', JSON.stringify($userStore));
            alert(textResponse);  // A szerver szöveges válaszát megjelenítjük

            // Inputok törlése a sikeres módosítás után
            newEmail = '';  // Ürítjük az input mezőt
        } else {
            alert(`Hiba történt az email cím módosítása közben: ${textResponse}`);
        }
    } catch (error) {
        console.error('Hiba történt:', error);
        alert('Hiba történt az email cím módosítása közben, kérlek próbáld újra.');
    }
};



const updatePassword = async () => {
    const response = await fetch('https://localhost:7214/api/Account/update-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
    });

    try {
        const textResponse = await response.text();  // Válasz szöveges formátumban

        if (response.ok) {
            alert(textResponse);  // A szerver szöveges válaszát megjelenítjük

            // Inputok törlése a sikeres módosítás után
            oldPassword = '';  // Ürítjük az input mezőt
            newPassword = '';  // Ürítjük az input mezőt
        } else {
            alert(`Hiba történt a jelszó módosítása közben: ${textResponse}`);
        }
    } catch (error) {
        console.error('Hiba történt:', error);
        alert('Hiba történt a jelszó módosítása közben, kérlek próbáld újra.');
    }
};



    const deleteProfile = async () => {
        if (confirm('Biztosan törölni szeretnéd a profilodat?')) {
            const response = await fetch('https://localhost:7214/api/Account/delete-profile', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Töröljük a store-t és localStorage-t
                $userStore.set({ id: '', firstName: '', lastName: '', email: '', photo: null, roles: [], userName: '' });
                $isLoggedIn.set(false);
                localStorage.removeItem('user');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('authToken');
                alert('Profil sikeresen törölve');
            } else {
                alert('Hiba történt a profil törlése közben');
            }
        }
    };
</script>


<div class="content mt-5">
    <div class="container mt-4">
        <main>
            <div id="details">
                <h1 class="text-center pb-5">{lastName} {firstName}</h1>
                <table class="table">
                    <tbody>
                        <tr>
                            <td class="bg-danger text-white">Felhasználónév:</td>
                            <td class="bg-danger text-white text-center">{userName}</td>
                            <td class="bg-danger text-white">
                                <input type="text" bind:value={newUsername} placeholder="Új felhasználónév" />
                            </td>
                            <td class="bg-danger text-white">
                                <button class="btn btn-success" on:click={updateUsername}>Módosítás</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="bg-danger text-white">Email cím:</td>
                            <td class="bg-danger text-white text-center">{email}</td>
                            <td class="bg-danger text-white">
                                <input type="text" bind:value={newEmail} placeholder="Új email" />
                            </td>
                            <td class="bg-danger text-white">
                                <button class="btn btn-success" on:click={updateEmail}>Módosítás</button>
                            </td>
                        </tr>
                        <tr>
                            <td class="bg-danger text-white">Jelszó:</td>
                            <td class="bg-danger text-white">
                                <input type="password" bind:value={oldPassword} placeholder="Jelenlegi jelszó" />
                            </td>
                            <td class="bg-danger text-white">
                                <input type="password" bind:value={newPassword} placeholder="Új jelszó" />
                            </td>
                            <td class="bg-danger text-white">
                                <button class="btn btn-success" on:click={updatePassword}>Módosítás</button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="bg-danger"></td>
                            <td class="bg-danger">
                                <button class="btn delete" on:click={deleteProfile}>Profil törlése</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</div>

<style>
    .content {
        margin-left: 300px; /* Sidebar szélességének megfelelő eltolás */
        padding: 20px; /* Extra belső tér a tartalom körül */
        color: white; /* Alapértelmezett fehér szín a szövegekhez */
    }

    table {
        width: 100%;
    }

    td {
        width: 500px;
        vertical-align: middle; /* Függőleges középre igazítás */
        height: 60px; /* Cellák magasságának beállítása */
    }

    input {
        width: 90%;
        height: 40px; /* Az input mezők magassága */
        padding: 5px;
    }

    button {
        padding: 10px 20px; /* Gombok méretének beállítása */
        width: 150px;
    }

    .delete {
        background-color: rgb(120, 0, 0);
        color: white;
    }

    .btn:hover {
        color: greenyellow;
    }

    .delete:hover {
        color: red;
    }
</style>
