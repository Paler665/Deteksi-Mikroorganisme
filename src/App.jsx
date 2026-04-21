import { useRef, useState, useEffect } from "react"
import './DesignProto.css'
import './index.css' // Pastikan file ini ada atau hapus baris ini jika error

function App() {
  // State untuk data
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  
  // State untuk UX (Loading)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef(null)

  // 1. Handle saat user memilih file
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Buat preview lokal
      setPreview(URL.createObjectURL(file))
    }
  }

  // 2. Handle tombol "Proses Gambar" (Integrasi Backend)
  const handleSegmentation = async () => {
    if (!imageFile) return

    // Mulai Loading
    setIsLoading(true)

    const formData = new FormData()
    formData.append("file", imageFile)

    try {
      // Tembak ke Backend Python
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Gagal memproses gambar")
      }

      const data = await response.json()

      // Update preview dengan gambar hasil dari AI (Base64)
      setPreview(`data:image/jpeg;base64,${data.result_image}`)
      
      // Opsional: Kasih notif kecil
      // alert("Selesai!") 

    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan: " + error.message)
    } finally {
      // Stop Loading (mau sukses atau gagal, loading harus berhenti)
      setIsLoading(false)
    }
  }

  // Cleanup memory
  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith("data:")) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <div className="App">
      <div className="Wrapper">
        <h1>Segmentasi Mikroorganisme Berbasis Web dan YOLOv12</h1>
        
        {/* Input Tersembunyi */}
        <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }} 
        />

        {/* Wrapper Tombol */}
        <div className="btn-wrapper">
          {/* Tombol Pilih Gambar */}
          <button 
            className="button" 
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading} // Gabisa diklik kalau lagi loading
          >
            Pilih Gambar
          </button>

          {/* Tombol Proses (Hanya muncul jika sudah ada gambar) */}
          {imageFile && (
            <button 
              className="button" 
              onClick={handleSegmentation}
              disabled={isLoading} // Gabisa diklik kalau lagi loading
              style={{ backgroundColor: isLoading ? "#ccc" : "" }} // Ubah warna kalau loading
            >
              {isLoading ? "Sedang Memproses..." : "Proses Gambar"}
            </button>
          )}
        </div>

        {/* Area Preview Gambar */}
        <div className="preview">
          {preview ? (
            <img 
                src={preview} 
                alt="Preview Mikroorganisme" 
                style={{ 
                  maxWidth: "350px", 
                  maxHeight: "350px", 
                  border: "1px solid #ccc",
                  marginTop: "20px",
                  borderRadius: "10px"
                }} 
            />
          ) : (
            <p style={{ color: "#888", marginTop: "20px" }}>
              Silakan pilih gambar mikroorganisme dahulu.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}

export default App