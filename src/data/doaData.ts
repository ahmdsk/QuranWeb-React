export interface DoaItem {
  id: number
  judul: string
  arab: string
  latin: string
  terjemah: string
  kategori: string
  source?: string
}

export interface MyQuranDoaApiItem {
  id: string | number
  judul: string
  doa: string
  latin: string
  artinya: string
  source?: string
}

export const FALLBACK_DOA_LIST: DoaItem[] = [
  {
    id: 1,
    judul: 'Doa Sebelum Tidur',
    kategori: 'Harian',
    arab: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ',
    latin: 'Bismikallohumma ahyaa wa amuut.',
    terjemah: 'Dengan nama-Mu ya Allah, aku hidup dan aku mati.'
  },
  {
    id: 2,
    judul: 'Doa Bangun Tidur',
    kategori: 'Harian',
    arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alhamdulillahil-ladzii ahyaanaa ba’da maa amaatanaa wa ilaihin-nusyuur.',
    terjemah: 'Segala puji bagi Allah yang telah menghidupkan kami kembali setelah mematikan kami, dan hanya kepada-Nya kami dibangkitkan.'
  },
  {
    id: 3,
    judul: 'Doa Sebelum Makan',
    kategori: 'Harian',
    arab: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: 'Allohumma baarik lanaa fiimaa rozaqtanaa wa qinaa ‘adzaaban-naar.',
    terjemah: 'Ya Allah, berkahilah rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka.'
  },
  {
    id: 4,
    judul: 'Doa Sesudah Makan',
    kategori: 'Harian',
    arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latin: 'Alhamdulillahil-ladzii ath’amanaa wa saqoanaa wa ja’alanaa muslimiin.',
    terjemah: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami termasuk golongan orang-orang Muslim.'
  },
  {
    id: 5,
    judul: 'Doa Masuk Masjid',
    kategori: 'Shalat & Wudhu',
    arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allohummaftah lii abwaaba rohmatik.',
    terjemah: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.'
  },
  {
    id: 6,
    judul: 'Doa Keluar Masjid',
    kategori: 'Shalat & Wudhu',
    arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allohumma innii as-aluka min fadlik.',
    terjemah: 'Ya Allah, sesungguhnya aku memohon kepada-Mu keutamaan dari-Mu.'
  },
  {
    id: 7,
    judul: 'Doa Masuk Kamar Mandi / WC',
    kategori: 'Harian',
    arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    latin: 'Allohumma innii a’uudzu bika minal khubutsi wal khobaa-its.',
    terjemah: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari godaan setan laki-laki dan setan perempuan.'
  },
  {
    id: 8,
    judul: 'Doa Keluar Kamar Mandi',
    kategori: 'Harian',
    arab: 'غُفْرَانَكَ الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الأَذَى وَعَافَانِي',
    latin: 'Ghufronakal-hamdulillahil-ladzii adz-haba ‘annil adzaa wa ‘aafaanii.',
    terjemah: 'Aku memohon ampunan-Mu. Segala puji bagi Allah yang telah menghilangkan kotoran/penyakit dariku dan menyahatkanku.'
  },
  {
    id: 9,
    judul: 'Dzikir Pagi: Ayat Kursi',
    kategori: 'Pagi & Petang',
    arab: 'اللَّهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    latin: 'Allahu laa ilaaha illaa huwal-hayyul-qayyum, laa ta’khudzuhuu sinatuw-wa laa naum...',
    terjemah: 'Allah, tidak ada tuhan selain Dia Yang Mahahidup lagi terus-menerus mengurus makhluk-Nya. Tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan di bumi.'
  },
  {
    id: 10,
    judul: 'Dzikir Pagi & Petang: Sayyidul Istighfar',
    kategori: 'Pagi & Petang',
    arab: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    latin: 'Allohumma anta robbii laa ilaaha illaa anta kholaqtanii wa ana ‘abduka wa ana ‘alaa ‘ahdika wa wa’dika mastatho’tu...',
    terjemah: 'Ya Allah, Engkau adalah Rabbku, tidak ada ilah yang berhak disembah selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu...'
  },
  {
    id: 11,
    judul: 'Doa Naik Kendaraan',
    kategori: 'Perjalanan',
    arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    latin: 'Subhaanal-ladzii sakh-khoro lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa robbinaa lamunqolibuun.',
    terjemah: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Rabb kami.'
  },
  {
    id: 12,
    judul: 'Doa Mohon Kebaikan Dunia & Akhirat (Sapu Jagat)',
    kategori: 'Keluarga',
    arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Robbanaa aatinaa fid-dunyaa hasanataw-wa fil aakhiroti hasanataw-wa qinaa ‘adzaaban-naar.',
    terjemah: 'Ya Rabb kami, berilah kami kebaikan di dunia dan kebaikan di akhirat serta peliharalah kami dari siksa api neraka.'
  }
]

export const DOA_LIST_DATA = FALLBACK_DOA_LIST

const mapCategory = (judul: string, source?: string): string => {
  const lower = judul.toLowerCase()
  if (source === 'quran' || lower.includes('qur\'an') || lower.includes('quran')) return 'Al-Qur\'an'
  if (lower.includes('tidur') || lower.includes('makan') || lower.includes('rumah') || lower.includes('pakaian') || lower.includes('kamar mandi')) return 'Harian'
  if (lower.includes('pagi') || lower.includes('petang') || lower.includes('dzikir')) return 'Pagi & Petang'
  if (lower.includes('solat') || lower.includes('shalat') || lower.includes('wudhu') || lower.includes('masjid')) return 'Shalat & Wudhu'
  if (lower.includes('bepergian') || lower.includes('kendaraan') || lower.includes('perjalanan') || lower.includes('safar')) return 'Perjalanan'
  if (lower.includes('orang tua') || lower.includes('anak') || lower.includes('suami') || lower.includes('istri') || lower.includes('keluarga') || lower.includes('jodoh')) return 'Keluarga'
  return 'Lainnya'
}

export async function fetchDoaList(): Promise<DoaItem[]> {
  try {
    const res = await fetch('https://api.myquran.com/v2/doa/semua')
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const result = await res.json()
    if (result.status && Array.isArray(result.data)) {
      return result.data.map((item: MyQuranDoaApiItem, index: number) => ({
        id: Number(item.id) || index + 1,
        judul: item.judul,
        arab: item.doa,
        latin: item.latin || '',
        terjemah: item.artinya || '',
        kategori: mapCategory(item.judul, item.source),
        source: item.source
      }))
    }
    return FALLBACK_DOA_LIST
  } catch (error) {
    console.error('Gagal mengambil data doa dari API, menggunakan fallback offline:', error)
    return FALLBACK_DOA_LIST
  }
}

