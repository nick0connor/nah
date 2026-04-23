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

export async function download(index) {
    const res = await fetch(`${BASE_URL}/confirm`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ index })
    });

    return res.json();
}

export async function cancel(infoHash) {
    const res = await fetch(`${BASE_URL}/cancel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ infoHash })
    });

    return res.json();
}