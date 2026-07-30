# solana-wallet-toolkit examples

[](https://www.rust-lang.org/) [](https://www.typescriptlang.org/) [](https://solana.com/)

## Example 1

```bash
# Clone the repository
git clone https://github.com/nirholas/solana-wallet-toolkit.git
cd solana-wallet-toolkit/rust

# Build release binary
cargo build --release

# Binary is at target/release/solana-vanity
```

## Example 2

```bash
cd solana-wallet-toolkit/typescript

# Install dependencies
npm install

# Build
npm run build
```

## Example 3

```bash
# Requires Solana CLI tools installed
# https://docs.solana.com/cli/install-solana-cli-tools

cd solana-wallet-toolkit/scripts
chmod +x *.sh
```

## Example 4

```bash
# Generate address starting with "ABC"
./solana-vanity --prefix ABC

# Generate address ending with "XYZ"
./solana-vanity --suffix XYZ

# Both prefix and suffix
./solana-vanity --prefix AB --suffix 99

# Case-insensitive matching
./solana-vanity --prefix abc --ignore-case

# Specify number of threads
./solana-vanity --prefix ABC --threads 8

# Custom output file
./solana-vanity --prefix Sol --output my-wallet.json

# Generate multiple addresses
./solana-vanity --prefix A --count 5

# Estimate time without generating (dry run)
./solana-vanity --prefix ABCD --dry-run

# Quiet mode (just output public key)
./solana-vanity --prefix AB --quiet
```

## Example 5

```bash
# Using ts-node
npx ts-node src/index.ts --prefix ABC

# Or after building
node dist/index.js --prefix ABC --suffix XYZ
```

## Example 6

```bash
# Generate vanity address using solana-keygen grind
./scripts/generate-vanity.sh Sol

# Batch generate from file
./scripts/batch-generate.sh prefixes.txt

# Verify a keypair file
./scripts/verify-keypair.sh my-wallet.json
```

## Example 7

```text
solana-wallet-toolkit/
├── rust/                    # High-performance Rust implementation
│   ├── src/
│   │   ├── main.rs          # CLI entry point
│   │   ├── lib.rs           # Library exports
│   │   ├── generator.rs     # Core generation logic
│   │   ├── matcher.rs       # Pattern matching
│   │   ├── output.rs        # File output (Solana CLI format)
│   │   └── security.rs      # Secure memory handling
│   ├── Cargo.toml
│   └── README.md
│
├── typescript/              # Node.js implementation
│   ├── src/
│   │   ├── index.ts         # CLI entry point
│   │   └── lib/
│   │       ├── generator.ts # Core generation logic
│   │       ├── matcher.ts   # Pattern matching
│   │       ├── output.ts    # File output
│   │       └── security.ts  # Security utilities
│   ├── package.json
│   └── README.md
│
├── scripts/                 # Shell script wrappers
│   ├── generate-vanity.sh   # Single address generation
│   ├── batch-generate.sh    # Batch generation
│   ├── verify-keypair.sh    # Keypair verification
│   └── utils.sh             # Shared utilities
│
├── tests/                   # Test suites
│   ├── cli/                 # CLI tests
│   ├── integration/         # Cross-implementation tests
│   ├── fuzz/                # Fuzz testing
│   └── stress/              # Stress tests
│
├── security/                # Security documentation
│   ├── SECURITY_CHECKLIST.md
│   └── audit-*.md
│
├── docs/                    # Documentation
│   └── cli-guide.md
│
└── tools/                   # Utility tools
    ├── verify-keypair.ts
    └── check-file-permissions.sh
```

## Example 8

```bash
# Run all tests
./run-all-tests.sh

# Rust tests
cd rust && cargo test

# TypeScript tests
cd typescript && npm test

# Integration tests
./tests/integration/test_keypair_validity.sh
./tests/integration/test_output_compatibility.sh
```


Every snippet above is taken from the [repository documentation](https://github.com/nirholas/solana-wallet-toolkit#readme).
