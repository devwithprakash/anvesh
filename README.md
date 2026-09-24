# Anvesh
Your AI-powered knowledge assistant for deep thinking and document analysis.

## About / What is this?
Anvesh is a full-stack AI knowledge application that allows users to upload documents (PDFs, text files, web pages) and interact with them using natural language. Built to help researchers, students, and teams synthesize information quickly and efficiently, it acts as your personal, context-aware AI assistant.

## Features
- **Upload Any Source**: Support for PDFs, text files, and web pages.
- **Smart Summaries**: Get concise overviews of long documents instantly without reading them.
- **Multi-Source Reasoning**: Ask questions that span multiple documents to find hidden connections.
- **Private by Default**: Your data is secure and never used for training external models.
- **Instant Answers**: Fast response times for complex queries using state-of-the-art AI.

## Getting Started (or Installation)

### Prerequisites
Make sure you have Node.js, npm/pnpm, and Docker installed on your machine.

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Notbook-LM
```

### 2. Install dependencies
For the client (Next.js):
```bash
cd client
npm install
# or pnpm install
```

For the server (Express):
```bash
cd ../server
pnpm install
```

### 3. Set up Environment Variables
Create a `.env` file in both the `client` and `server` directories. Configure your database URLs, API keys (e.g., OpenAI, Pinecone), and other required variables as needed for the project.

### 4. Run the Application
**Using Docker Compose (Recommended):**
```bash
docker-compose up -d
```

**Running manually:**
- **Client**: Navigate to `client` and run `npm run dev`
- **Server**: Navigate to `server` and run `pnpm run dev`

## Usage (or How to Use)
1. Open your browser and navigate to the client URL (e.g., `http://localhost:3000`).
2. Create an account or sign in to your existing account.
3. Create a new workspace and upload your documents (e.g., a research PDF or lecture notes).
4. Use the chat interface to ask questions across your uploaded content or click to generate an instant summary!

## Tech Stack
**Frontend (Client):**
- **Next.js & React**: Framework for the user interface.
- **Tailwind CSS & Framer Motion**: For styling, responsive design, and smooth animations.
- **Shadcn UI**: Accessible component library.

**Backend (Server):**
- **Node.js & Express**: Core server framework.
- **TypeScript**: For type-safe code across the stack.
- **Prisma**: ORM connecting to the PostgreSQL database.
- **Pinecone**: Vector database for fast semantic search and retrieval (RAG).
- **OpenAI & AI SDK**: Powering the language models and natural language generation.
- **Better-Auth & Razorpay**: For authentication and subscription billing.

**Infrastructure:**
- **Docker & Docker Compose**: For containerization and easy deployment.

## Future Improvements
- **Expanded File Support**: Add capabilities for handling Word documents (.docx), Excel spreadsheets, and PowerPoint presentations.
- **Advanced Collaboration**: Real-time multiplayer features allowing team members to chat and take notes together in a shared workspace.
- **Third-party Integrations**: Sync directly with Notion, Google Drive, and Dropbox for seamless document importing.
- **Local AI Models**: Support for running fully local, privacy-first open-source models (like Llama 3 or Mistral via Ollama) offline.

## License
This project is licensed under the MIT License. You are free to use, modify, and distribute this software as per the terms of the license.
