fetch('http://localhost:3000/api/test-cloudinary')
    .then(r => r.text())
    .then(console.log)
    .catch(console.error)
