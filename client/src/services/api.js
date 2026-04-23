const BASE_URL = "http://localhost:3000";

export async function search(query, media) {
    const res = await fetch(`${BASE_URL}/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, media })
    });

    return res.json();
}

