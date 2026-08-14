export function acquirePhotoFile({ desordreId }) {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'
    input.multiple = false
    input.style.display = 'none'
    input.id = `photo-input-${desordreId}`

    const cleanup = () => {
      input.onchange = null
      input.remove()
    }

    input.addEventListener(
      'change',
      (event) => {
        const files = Array.from(event.target.files || [])
        cleanup()
        resolve(files)
      },
      { once: true }
    )

    try {
      document.body.appendChild(input)
      input.click()
    } catch (error) {
      cleanup()
      resolve([])
    }
  })
}
