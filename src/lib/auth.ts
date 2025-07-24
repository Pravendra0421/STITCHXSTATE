// This function is safe to use in client components
export async function getCurrentUser() {
  try {
    const res = await fetch('http://localhost:3000/api/users/me', {
      method: 'GET',
      credentials: 'include', 
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}
