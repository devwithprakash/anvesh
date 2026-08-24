indexing for a pdf 

{ prompt_tokens: 1331, total_tokens: 1331 }

text-embedding-3-small = $0.02 per 1 million tokens 

1,331 / 1,000,000 × $0.02 = $0.00002662

$5 would cover roughly 187,000 such indexing operations.

Query :

1. "What is the average price of laptops in india"
{
  inputTokens: 228,
  inputTokenDetails: { noCacheTokens: 228, cacheReadTokens: 0, cacheWriteTokens: 0 },
  outputTokens: 223,
  outputTokenDetails: { textTokens: 223, reasoningTokens: 0 },
  totalTokens: 451
}

2. "Tell me about the Naruto Uzumaki"
 {
  inputTokens: 173,
  inputTokenDetails: { noCacheTokens: 173, cacheReadTokens: 0, cacheWriteTokens: 0 },
  outputTokens: 377,
  outputTokenDetails: { textTokens: 377, reasoningTokens: 0 },
  totalTokens: 550
}

3. "What is the status of gaming industry now days"
 {
  inputTokens: 247,
  inputTokenDetails: { noCacheTokens: 247, cacheReadTokens: 0, cacheWriteTokens: 0 },
  outputTokens: 381,
  outputTokenDetails: { textTokens: 381, reasoningTokens: 0 },
  totalTokens: 628
}


TEST 1

Q. What is Spiral model in SDLC?
A. The Spiral Model in the Software Development Life Cycle (SDLC) is a risk-driven process model that emphasizes iterative development and incorporates elements from other models. It is particularly suited for large-scale projects with complicated requirements.

Key aspects of the Spiral Model include:

1. **Cyclical Process**: The software development process is represented as a spiral, with each loop corresponding to a different phase of development, such as objective setting, risk assessment, development, and planning for the next iteration.

2. **Risk Management**: At each stage, risks are identified and evaluated, allowing for proactive management and mitigation strategies, making it well-suited for projects with unknown risks.

3. **Prototyping**: The model allows for the creation of prototypes at various stages, aiding in identifying and addressing potential issues early on.

4. **Flexibility**: It facilitates incorporating changes even late in the development process, making it adaptable to evolving requirements.

5. **Stakeholder Involvement**: Regular feedback from clients and stakeholders is encouraged, leading to improved communication and satisfaction throughout the development cycle.

The Spiral Model is ideal for large, complex projects where risk handling is crucial, as it combines systematic planning with flexible, iterative execution [4], [5], [6].

Token Usage:
{
  inputTokens: 4225,
  inputTokenDetails: { noCacheTokens: 4225, cacheReadTokens: 0, cacheWriteTokens: 0 },
  outputTokens: 255,
  outputTokenDetails: { textTokens: 255, reasoningTokens: 0 },
  totalTokens: 4480
}

TEST 2

Q. What is Formal Methods in SDLC?
A. Formal methods in the Software Development Life Cycle (SDLC) refer to mathematically oriented techniques used to ensure the correctness and reliability of software systems. They involve rigorous specification, development, and verification of software, aiming to reduce errors and enhance reliability throughout the development process.

Key aspects include:

1. **Specification**: Defining system behavior and intended characteristics using formal specification languages.
  
2. **Verification**: Proving or disproving a system’s correctness relative to its formal specifications through techniques such as model checking and theorem proving.

3. **Iterative Process**: Formal methods can be applied iteratively, allowing for specification, verification, and refinement in collaboration with stakeholders.

4. **Integration**: These methods can be integrated into Agile and DevOps practices, maintaining a balance between flexibility and rigorous verification of software systems to meet quality and reliability requirements [1][2][3].

Token Usage:
 {
  inputTokens: 4167,
  inputTokenDetails: { noCacheTokens: 4167, cacheReadTokens: 0, cacheWriteTokens: 0 },
  outputTokens: 178,
  outputTokenDetails: { textTokens: 178, reasoningTokens: 0 },
  totalTokens: 4345
}

ADVANCE RAG PIPELINE

TEST 1

Q. What is software engineering?
A. Software engineering is the process, methods, and tools used to create complex computer-based systems efficiently and with quality. It encompasses various activities including software specification, design, implementation, testing, deployment, and maintenance. The goal is to deliver high-quality software that meets user requirements on time and within budget, while also ensuring productivity and reliability. It is guided by fundamental principles and seeks to enhance productivity and quality while minimizing costs and time-to-market through effective engineering processes and practices [1][2].

Token Usage
{
  inputTokens: 4153,
  inputTokenDetails: { noCacheTokens: 4153, cacheReadTokens: 0, cacheWriteTokens: 0 },
  outputTokens: 98,
  outputTokenDetails: { textTokens: 98, reasoningTokens: 0 },
  totalTokens: 4251
}

TEST 2

Q. What is Formal Methods in SDLC?
A. Formal methods in the Software Development Life Cycle (SDLC) refer to mathematically oriented techniques used to ensure the correctness and reliability of software systems. They involve rigorous specification of system behavior using formal specification languages, which provide precise definitions of a system's requirements and intended characteristics.

These methods can be applied iteratively throughout the development process, allowing for the specification, verification, and refinement of system requirements and designs in collaboration with stakeholders. Tools and techniques for formal specification and verification may be integrated into the development workflow, enabling continuous verification and validation of software artifacts.

The goals of formal methods include reducing errors and inconsistencies, facilitating early error detection, enhancing clarity in communication with stakeholders, and ensuring the security and reliability of critical systems [1][2][3].

Token Usage
{
  inputTokens: 3462,
  inputTokenDetails: { noCacheTokens: 3462, cacheReadTokens: 0, cacheWriteTokens: 0 },
  outputTokens: 151,
  outputTokenDetails: { textTokens: 151, reasoningTokens: 0 },
  totalTokens: 3613
}