import { useEffect, useState } from 'react'

function App() {
  const [hoodies, setHoodies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contact, setContact] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/hoodies`)
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setHoodies(data)
      } catch (e) {
        setError('Unable to load hoodies right now.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(false)
    try {
      const res = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      setContact({ name: '', email: '', phone: '', message: '' })
    } catch (e) {
      alert('Could not send message. Please try later.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">Hoodie Wala</div>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#hoodies" className="hover:text-blue-600">Hoodies</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
            <a href="/test" className="text-gray-500 hover:text-blue-600">Status</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Premium Hoodies for Everyday Comfort</h1>
            <p className="mt-4 text-gray-600">Soft fabrics. Clean designs. Perfect fit. Explore our curated collection of hoodies built for comfort and style.</p>
            <div className="mt-6 flex gap-3">
              <a href="#hoodies" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Browse Hoodies</a>
              <a href="#contact" className="px-5 py-2 rounded-lg border hover:bg-gray-50">Contact Us</a>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600&auto=format&fit=crop" alt="Hoodie" className="rounded-xl shadow-lg w-full object-cover" />
          </div>
        </div>
      </section>

      <section id="hoodies" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Hoodies</h2>
        {loading ? (
          <p className="text-gray-600">Loading hoodies...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hoodies.map((h, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  <img src={h.image_url || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop'} alt={h.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 flex-1">
                  <h3 className="font-semibold text-lg">{h.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{h.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-blue-600 font-bold">${'{'}h.price.toFixed(2){'}'}</div>
                    {h.colors?.length > 0 && (
                      <div className="flex gap-1">
                        {h.colors.slice(0,4).map((c,i)=> (
                          <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 rounded">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="contact" className="bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-6">Contact</h2>
          <p className="text-gray-600 mb-6">Have a question or bulk enquiry? Send us a message and we’ll get back to you.</p>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">
            <input value={contact.name} onChange={e=>setContact({...contact, name:e.target.value})} required placeholder="Name" className="border rounded-lg px-3 py-2" />
            <input type="email" value={contact.email} onChange={e=>setContact({...contact, email:e.target.value})} required placeholder="Email" className="border rounded-lg px-3 py-2" />
            <input value={contact.phone} onChange={e=>setContact({...contact, phone:e.target.value})} placeholder="Phone (optional)" className="border rounded-lg px-3 py-2 md:col-span-2" />
            <textarea value={contact.message} onChange={e=>setContact({...contact, message:e.target.value})} required placeholder="Your message" rows="4" className="border rounded-lg px-3 py-2 md:col-span-2" />
            <div className="md:col-span-2 flex items-center gap-3">
              <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Send</button>
              {submitted && <span className="text-green-600">Thanks! We received your message.</span>}
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Hoodie Wala</p>
          <a href="#top" className="hover:text-blue-600">Back to top</a>
        </div>
      </footer>
    </div>
  )
}

export default App
