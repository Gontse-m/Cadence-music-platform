use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("YOUR_PROGRAM_ID_HERE");

#[program]
pub mod cadence {
    use super::*;

    /// Register a new track on-chain
    pub fn register_track(
        ctx: Context<RegisterTrack>,
        track_id: String,
        ipfs_hash: String,
        price_per_stream: u64,
    ) -> Result<()> {
        let track = &mut ctx.accounts.track;
        track.artist = ctx.accounts.artist.key();
        track.track_id = track_id;
        track.ipfs_hash = ipfs_hash;
        track.price_per_stream = price_per_stream;
        track.stream_count = 0;
        track.total_earned = 0;
        Ok(())
    }

    /// Pay for a stream — sends SOL to artist and platform
    pub fn pay_for_stream(ctx: Context<PayForStream>, amount: u64) -> Result<()> {
        let platform_fee = amount * 15 / 100;
        let artist_share = amount - platform_fee;

        // Transfer artist share
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.listener.to_account_info(),
                    to: ctx.accounts.artist.to_account_info(),
                },
            ),
            artist_share,
        )?;

        // Transfer platform fee
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.listener.to_account_info(),
                    to: ctx.accounts.platform.to_account_info(),
                },
            ),
            platform_fee,
        )?;

        // Update stream count and earnings
        let track = &mut ctx.accounts.track;
        track.stream_count += 1;
        track.total_earned += artist_share;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(track_id: String)]
pub struct RegisterTrack<'info> {
    #[account(
        init,
        payer = artist,
        space = 8 + 32 + 64 + 64 + 8 + 8 + 8,
        seeds = [b"track", artist.key().as_ref(), track_id.as_bytes()],
        bump
    )]
    pub track: Account<'info, TrackAccount>,
    #[account(mut)]
    pub artist: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayForStream<'info> {
    #[account(mut)]
    pub track: Account<'info, TrackAccount>,
    #[account(mut)]
    pub listener: Signer<'info>,
    /// CHECK: Artist wallet verified by track account
    #[account(mut, constraint = artist.key() == track.artist)]
    pub artist: AccountInfo<'info>,
    /// CHECK: Platform wallet from env
    #[account(mut)]
    pub platform: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct TrackAccount {
    pub artist: Pubkey,
    pub track_id: String,
    pub ipfs_hash: String,
    pub price_per_stream: u64,
    pub stream_count: u64,
    pub total_earned: u64,
}
