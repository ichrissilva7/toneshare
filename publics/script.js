fetch("/tones")
.then(res => res.json())
.then(data => {
  const container = document.getElementById("tones")

  data.forEach(tone => {
    container.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <h3>${tone.title}</h3>
        <p>${tone.description}</p>
        <p><strong>Equipamento:</strong> ${tone.gear}</p>
        <a href="/uploads/${tone.filename}" download>⬇ Download</a>
      </div>
    `
  })
})