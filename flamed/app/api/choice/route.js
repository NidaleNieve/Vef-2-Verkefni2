import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

// Server-side consensus picking. Receives multiple user's accepted Restaurant IDs and compares them to find the perfect restaurant.
export async function POST(request) {
  try {
    const body = await request.json();
    const userAcceptedIds = Array.isArray(body.acceptedIds) ? body.acceptedIds : [];

    //fetch active restaurants (could scope or limit further)
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('id,name,parent_city,avg_rating,cuisines,price_tag')
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    //GPT GENERATED
    // Dummy peer arrays (STATIC / SIMPLE)
    // Peer A picked the first 4 active restaurants
    const peerA = restaurants.slice(0, 4).map(r => r.id);
    // Peer B picked all with rating >= 4
    const peerB = restaurants.filter(r => (Number(r.avg_rating) || 0) >= 4).map(r => r.id);
    // Peer C picked those whose name length is even (arbitrary deterministic rule)
    const peerC = restaurants.filter(r => r.name && r.name.length % 2 === 0).map(r => r.id);


    const peers = [
      { id: 'you', accepted: userAcceptedIds },
      { id: 'peerA', accepted: peerA },
      { id: 'peerB', accepted: peerB },
      { id: 'peerC', accepted: peerC },
    ];

    // Count votes
    const voteMap = new Map();
    for (const p of peers) {
      for (const rid of p.accepted) {
        voteMap.set(rid, (voteMap.get(rid) || 0) + 1);
      }
    }

    const majority = Math.ceil(peers.length / 2);

    // Build consensus set
    const consensusIds = [];
    for (const [rid, count] of voteMap.entries()) {
      if (count >= majority) consensusIds.push(rid);
    }

    // Filter full restaurant objects
    const consensusRestaurants = restaurants.filter(r => consensusIds.includes(r.id));

    // Sort consensus: votes desc, then rating desc
    consensusRestaurants.sort((a, b) => {
      const vb = voteMap.get(b.id) || 0;
      const va = voteMap.get(a.id) || 0;
      if (vb !== va) return vb - va;
      const rb = Number(b.avg_rating) || 0;
      const ra = Number(a.avg_rating) || 0;
      return rb - ra;
    });

    const topPick = consensusRestaurants[0] || null;

    return NextResponse.json({
      peers,
      majority,
      votes: Object.fromEntries(voteMap),
      consensus: consensusRestaurants,
      topPick,
      yourAccepted: userAcceptedIds,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}