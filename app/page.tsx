'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [myLibrary, setMyLibrary] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [filterType, setFilterType] = useState('ANIME')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { fetchLibrary() }, [])

  async function fetchLibrary() {
    const { data } = await supabase.from('my_library').select('*').order('created_at', { ascending: false })
    setMyLibrary(data || [])
  }

  async function handleSearch(query: string) {
    setSearchQuery(query)
    if (query.length < 3) { setSearchResults([]); return }
    const apiQuery = `query ($search: String) { Page(perPage: 5) { media(search: $search) { id title { english romaji } coverImage { large } type countryOfOrigin } } }`
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: apiQuery, variables: { search: query } })
    })
    const result = await response.json()
    setSearchResults(result.data.Page.media || [])
  }

  async function addToLibrary(item: any) {
    let finalType = item.type;
    if (item.type === 'MANGA' && item.countryOfOrigin === 'KR') finalType = 'MANHWA';
    await supabase.from('my_library').insert([{
      anilist_id: item.id,
      title: item.title.english || item.title.romaji,
      image_url: item.coverImage.large,
      type: finalType,
      status: 'planning'
    }])
    setSearchQuery(''); setSearchResults([]); fetchLibrary();
  }

  async function updateStatus(id: number, status: string) {
    await supabase.from('my_library').update({ status }).eq('id', id)
    fetchLibrary()
  }

  const filteredList = myLibrary.filter(item => {
    const typeMatch = item.type === filterType;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return typeMatch && statusMatch;
  })

  return (
    <div className="bg-[#fbfae6] min-h-screen text-[#1b1d10] font-sans pb-20">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#fbfae6]/80 backdrop-blur-md border-b border-[#d2c4bb]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter text-[#715a48]">MEDIA VAULT</h1>
          
          <div className="relative w-80">
            <div className="flex items-center bg-[#f5f5e0] border border-[#81756d]/30 rounded-full px-4 py-2">
              <span className="material-symbols-outlined text-[#81756d] text-xl mr-2">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                placeholder="Search AniList..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-14 w-full bg-white shadow-2xl rounded-2xl border border-[#d2c4bb] overflow-hidden z-50">
                {searchResults.map(result => (
                  <div key={result.id} onClick={() => addToLibrary(result)} className="flex items-center p-3 hover:bg-[#f0efda] cursor-pointer transition-colors border-b border-[#f0efda] last:border-0">
                    <img src={result.coverImage.large} className="w-10 h-14 object-cover rounded-md shadow-sm" />
                    <div className="ml-3">
                      <p className="text-xs font-bold text-[#715a48]">{result.type}</p>
                      <p className="text-sm font-medium line-clamp-1">{result.title.english || result.title.romaji}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <header className="mb-16">
          <h2 className="text-6xl font-bold tracking-tight mb-4 text-[#1b1d10]">Welcome Back.</h2>
          <p className="text-xl text-[#4f453e] max-w-2xl leading-relaxed">Don't forget to log :P</p>
        </header>

        {/* FILTER SECTION */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 pb-8 border-b border-[#d2c4bb]">
          <div className="flex p-1.5 bg-[#f0efda] rounded-2xl">
            {['ANIME', 'MANGA', 'MANHWA'].map(t => (
              <button 
                key={t} onClick={() => setFilterType(t)}
                className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${filterType === t ? 'bg-[#5c614d] text-white shadow-lg' : 'text-[#5c614d] hover:bg-[#c1c6af]/30'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {['all', 'planning', 'watching', 'completed', 'on-hold'].map(s => (
              <button 
                key={s} onClick={() => setFilterStatus(s)}
                className={`px-5 py-2 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-[#715a48] text-white border-[#715a48]' : 'border-[#81756d] text-[#4f453e] hover:bg-[#eae9d5]'}`}
              >
                {s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </section>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredList.map((item) => (
            <div key={item.id} className="group relative flex flex-col bg-white rounded-3xl border border-[#d2c4bb]/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="relative aspect-[3/4] overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-lg bg-[#fbfae6]/90 backdrop-blur-sm text-[#715a48] text-[10px] font-black uppercase tracking-tighter shadow-sm">
                    {item.status}
                  </span>
                </div>
                <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4 line-clamp-1 text-[#1b1d10]">{item.title}</h3>
                <div className="relative">
                  <select 
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="w-full bg-[#f5f5e0] text-[#715a48] border-none rounded-xl px-4 py-2.5 text-xs font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-[#715a48]"
                  >
                    <option value="planning">Plan to Watch</option>
                    <option value="watching">Currently Watching</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="dropped">Dropped</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs">expand_more</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredList.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
            <p className="text-xl font-medium">Your {filterType.toLowerCase()} vault is empty.</p>
          </div>
        )}
      </main>
    </div>
  )
}