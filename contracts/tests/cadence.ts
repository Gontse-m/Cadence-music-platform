import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'

describe('cadence', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  it('Is initialized!', async () => {
    // Add tests here once the program ID is set.
    console.log('Replace YOUR_PROGRAM_ID_HERE in lib.rs and Anchor.toml, then write tests against the deployed program.')
  })
})
