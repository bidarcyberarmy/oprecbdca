export interface Division {
  id: string;
  name: string;
  tagline: string;
  description: string;
  responsibilities: string[];
  skillsAndTools: string[];
  idealFor: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  imageUrl?: string;
  link?: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  role: string;
  division: string;
  photoUrl: string;
}

export interface OprecConfig {
  isOpen: boolean;
  periodLabel: string;
  registrationDeadline: string;
  registrationDeadlineIso: string;
  closedMessage: string;
  about: {
    headline: string;
    description: string;
    pillars: { title: string; detail: string }[];
  };
  divisions: Division[];
  portfolios: PortfolioItem[];
  members: MemberProfile[];
}

export const BDCA_LINKS = {
  mainSite: "https://www.bidarcyberarmy.org/",
  instagram: "https://www.instagram.com/bidarcyberarmy/",
  github: "https://github.com/bidarcyberarmy",
  email: "contact@bidarcyberarmy.org",
  panitiaWhatsappDisplay: "0822-7833-0156",
  panitiaWhatsappUrl: "https://wa.me/6282278330156",
} as const;

export interface MajorGroup {
  faculty: string;
  majors: string[];
}

export const UBD_MAJOR_GROUPS: MajorGroup[] = [
  {
    faculty: "Fakultas Sains Teknologi",
    majors: [
      "Sistem Informasi (S1)",
      "Teknik Informatika (S1)",
      "Teknik Sipil (S1)",
      "Teknik Elektro (S1)",
      "Teknik Industri (S1)",
    ],
  },
  {
    faculty: "Fakultas Vokasi",
    majors: [
      "Manajemen Informatika (D3)",
      "Teknik Komputer (D3)",
      "Administrasi Bisnis (D3)",
      "Pengelolaan Perhotelan (D4)",
    ],
  },
  {
    faculty: "Fakultas Sosial Humaniora",
    majors: [
      "Manajemen (S1)",
      "Akuntansi (S1)",
      "Ilmu Komunikasi (S1)",
      "Psikologi (S1)",
      "Pendidikan Bahasa Indonesia (S1)",
      "Pendidikan Olahraga (S1)",
      "Sastra Inggris (S1)",
    ],
  },
  {
    faculty: "Program Pascasarjana",
    majors: [
      "Manajemen (S2)",
      "Teknik Informatika (S2)",
      "Ilmu Komunikasi (S2)",
      "Teknik Sipil (S2)",
      "Pendidikan Jasmani (S2)",
    ],
  },
];

export const UBD_MAJORS = [
  ...UBD_MAJOR_GROUPS.flatMap((group) => group.majors),
  "Lainnya",
] as const;

export const SEMESTER_OPTIONS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8+",
] as const;

export const oprecConfig: OprecConfig = {
  isOpen: true,
  periodLabel: "Batch 2026/2027",
  registrationDeadline: "2 Desember 2026, 23:59 WIB",
  registrationDeadlineIso: "2026-12-02T23:59:59+07:00",
  closedMessage:
    "Pendaftaran Open Recruitment BDCA periode ini telah ditutup pada 2 Desember 2026 pukul 23:59 WIB. Pantau Instagram @bidarcyberarmy atau hubungi WhatsApp panitia untuk informasi gelombang berikutnya.",
  about: {
    headline: "Ruang belajar, riset, dan berkarya di bidang keamanan siber dan teknologi.",
    description:
      "Bina Darma Cyber Army (BDCA) adalah komunitas teknologi dan keamanan siber mahasiswa Universitas Bina Darma, Palembang, yang berdiri sejak 2009. Kami mempertemukan mahasiswa lintas program studi untuk belajar terstruktur, membangun sistem nyata, dan berkompetisi di tingkat regional maupun nasional.",
    pillars: [
      {
        title: "Riset & Keamanan Siber",
        detail:
          "Mempelajari keamanan jaringan, ethical hacking, kriptografi, forensik digital, serta latihan Capture The Flag (CTF) secara rutin.",
      },
      {
        title: "Pengembangan Perangkat Lunak",
        detail:
          "Merancang dan membangun aplikasi web, sistem internal komunitas, hingga eksperimen infrastruktur dengan praktik secure coding.",
      },
      {
        title: "Komunitas & Kolaborasi",
        detail:
          "Kultur belajar terbuka antarangkatan melalui kelas mingguan, proyek kolaboratif, workshop kampus, dan jejaring komunitas IT Palembang.",
      },
    ],
  },
  divisions: [
    {
      id: "education-research",
      name: "Education & Research (Cyber Security / CTF)",
      tagline: "Riset keamanan siber & kompetisi CTF.",
      description:
        "Fokus pada pembelajaran offensive & defensive security, pengelolaan lab latihan, dan pembinaan tim CTF BDCA.",
      responsibilities: [
        "Belajar rutin keamanan siber (Web, Network, Forensics, Cryptography).",
        "Membuat write-up riset dan soal latihan internal.",
        "Mengikuti kompetisi Capture The Flag (CTF) regional & nasional.",
      ],
      skillsAndTools: [],
      idealFor:
        "Mahasiswa yang penasaran cara kerja sistem dan keamanan siber. Pemula diterima — mulai dari dasar Linux & jaringan.",
    },
    {
      id: "software-development",
      name: "Software Development",
      tagline: "Pengembangan web & sistem internal BDCA.",
      description:
        "Fokus merancang, membangun, dan memelihara aplikasi web serta platform digital komunitas BDCA.",
      responsibilities: [
        "Membangun website dan sistem pendukung kegiatan BDCA.",
        "Kolaborasi proyek dengan Git, code review, dan praktik secure coding.",
        "Berbagi materi lewat sesi code clinic & mini-project.",
      ],
      skillsAndTools: [],
      idealFor:
        "Mahasiswa yang suka membangun website atau aplikasi. Pemula yang baru mengenal dasar pemrograman tetap diterima.",
    },
    {
      id: "creative-branding",
      name: "Creative & Branding",
      tagline: "Desain visual, konten, & dokumentasi.",
      description:
        "Fokus mengelola identitas visual, konten edukasi digital, dan dokumentasi kegiatan BDCA.",
      responsibilities: [
        "Membuat desain konten media sosial, poster, dan materi publikasi.",
        "Menjaga konsistensi tampilan visual BDCA di semua kanal digital.",
        "Mendokumentasikan workshop, kelas rutin, dan event kampus.",
      ],
      skillsAndTools: [],
      idealFor:
        "Mahasiswa yang berminat di desain grafis, UI/UX, foto/video, atau konten kreatif. Terbuka untuk pemula.",
    },
    {
      id: "public-relations",
      name: "Public Relations & Partnership",
      tagline: "Relasi kampus, alumni, & kolaborasi.",
      description:
        "Fokus menjalin komunikasi eksternal, kemitraan komunitas, serta koordinasi acara dan jaringan alumni.",
      responsibilities: [
        "Mengelola kerja sama dengan kampus dan komunitas IT eksternal.",
        "Menjaga relasi aktif dengan alumni BDCA untuk mentoring.",
        "Mengkoordinasikan publikasi dan kepanitiaan acara BDCA.",
      ],
      skillsAndTools: [],
      idealFor:
        "Mahasiswa dari semua prodi yang senang berkomunikasi, mengelola acara, dan memperluas relasi.",
    },
  ],
  portfolios: [
    {
      id: "bdcahoot",
      title: "BDCAHOOT",
      category: "Web System",
      year: "2025",
      summary:
        "Platform kuis interaktif real-time buatan tim Software Development BDCA yang digunakan pada seminar, kelas rutin, dan evaluasi materi keamanan siber di kampus.",
      link: "https://github.com/bidarcyberarmy",
    },
    {
      id: "bdca-certification",
      title: "BDCA Certification",
      category: "Web System & Security",
      year: "2025",
      summary:
        "Portal verifikasi sertifikat dan kredensial anggota berbasis kriptografi agar keaslian sertifikat pelatihan dan kepengurusan BDCA dapat divalidasi secara publik.",
      link: "https://www.bidarcyberarmy.org/",
    },
  ],
  members: [
    {
      id: "ahmad-ghumaydi",
      name: "Ahmad Ghumaydi",
      role: "Commander",
      division: "Core Leadership",
      photoUrl: "",
    },
    {
      id: "yeni-natalia",
      name: "Yeni Natalia",
      role: "Vice Commander",
      division: "Core Leadership",
      photoUrl: "",
    },
    {
      id: "dwi-margaretta",
      name: "Dwi Margaretta S",
      role: "General Secretary & Finance",
      division: "Core Leadership",
      photoUrl: "",
    },
    {
      id: "wihdatu-nuuro",
      name: "Wihdatu Nuuro Ahmadi",
      role: "Offensive Security Lead",
      division: "Education & Research",
      photoUrl: "",
    },
    {
      id: "muhammad-fahjri",
      name: "Muhammad Fahjri",
      role: "Defensive Security Lead",
      division: "Education & Research",
      photoUrl: "",
    },
    {
      id: "alif-agus-lerian",
      name: "Alif Agus Lerian",
      role: "Software Development Lead",
      division: "Software Development",
      photoUrl: "",
    },
    {
      id: "zalwanda-vadissa",
      name: "Zalwanda Vadissa Arla",
      role: "Social Media Specialist",
      division: "Creative & Branding",
      photoUrl: "",
    },
    {
      id: "m-sultan-haidar",
      name: "M. Sultan Haidar",
      role: "External Partnership",
      division: "Public Relations",
      photoUrl: "",
    },
  ],
};

export function isRegistrationOpen(now: Date = new Date()): boolean {
  if (!oprecConfig.isOpen) return false;
  const deadlineMs = Date.parse(oprecConfig.registrationDeadlineIso);
  if (Number.isNaN(deadlineMs)) return oprecConfig.isOpen;
  return now.getTime() <= deadlineMs;
}
