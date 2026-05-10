-- usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    handle TEXT UNIQUE NOT NULL,          -- @handle usado no perfil publico
    theme_palette TEXT DEFAULT 'default', -- referencia a paleta de cores
    theme_font   TEXT DEFAULT 'default',  -- referencia a fonte
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- livros (catalogo global)
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn TEXT UNIQUE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_url TEXT,
    publisher TEXT,
    published_year INTEGER,
    page_count INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- relacao usuario-livro (estante pessoal)
CREATE TABLE user_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started', -- not_started, reading, finished, dnf
    progress_page INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    UNIQUE (user_id, book_id)
);

-- sessoes de leitura
CREATE TABLE reading_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    start_page INTEGER NOT NULL,
    end_page   INTEGER NOT NULL,
    pages_read INTEGER GENERATED ALWAYS AS (end_page - start_page) STORED,
    start_time TIMESTAMPTZ NOT NULL,
    end_time   TIMESTAMPTZ NOT NULL,
    duration_min INTERVAL GENERATED ALWAYS AS (end_time - start_time) STORED,
    ppm        NUMERIC(6,2) GENERATED ALWAYS AS (
                    CASE WHEN EXTRACT(EPOCH FROM (end_time - start_time))/60 > 0
                         THEN (end_page - start_page) /
                              (EXTRACT(EPOCH FROM (end_time - start_time))/60)
                         ELSE 0 END) STORED,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- metas (por usuario-livro)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    goal_type TEXT NOT NULL CHECK (goal_type IN ('weekly_pages', 'fixed_date', 'streak')),
    target_value TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- streaks diarios (contagem de dias consecutivos com >=1 sessao)
CREATE TABLE user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    best_streak    INTEGER DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- feed de atividades
CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('finish', 'start', 'rating', 'session')),
    book_id UUID REFERENCES books(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
