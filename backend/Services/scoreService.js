// Normalize values between 0 and 1
function normalize(value, min, max) {
    if (max === min) return 0;
    return (value - min) / (max - min);
}

// Calculate score using weighted formula
function calculateScore(normalizedPrice, normalizedEta) {
    const priceWeight = 0.7;
    const etaWeight = 0.3;

    const score = (priceWeight * normalizedPrice) + (etaWeight * normalizedEta);
    return score;
}

// Main function to analyze rides
export function analyzeRides(rides) {

    // Extract all prices and ETA values
    const prices = rides.map(r => r.price);
    const etas = rides.map(r => r.eta);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const minEta = Math.min(...etas);
    const maxEta = Math.max(...etas);

    const scoredRides = rides.map(ride => {

        const normalizedPrice = normalize(ride.price, minPrice, maxPrice);
        const normalizedEta = normalize(ride.eta, minEta, maxEta);

        const score = calculateScore(normalizedPrice, normalizedEta);

        return {
            ...ride,
            normalizedPrice,
            normalizedEta,
            score
        };

    });

    // Sort by score (lower = better)
    scoredRides.sort((a, b) => a.score - b.score);

    const bestRide = scoredRides[0];

    return {
        bestRide,
        rides: scoredRides
    };
}


function calculateScoreDifference(bestRide, secondRide) {
    const bestScore = bestRide.score;
    const secondScore = secondRide.score;

    const scoreDifference = secondScore - bestScore;
    const percentage = scoreDifference / bestScore;
    return percentage;
}


function applyEcoTieBreaker(bestRide, secondRide) {

    const carbonBestRide = bestRide.carbon;
    const carbonSecondRide = secondRide.carbon;

    let finalBestRide;
    if (carbonSecondRide < carbonBestRide) {
        finalBestRide = secondRide;
    } else {
        finalBestRide = bestRide;
    }

    return finalBestRide;
}


function resolveTieBreaker(scoredRides) {

    // Edge case: agar 2 se kam rides hain
    if (scoredRides.length < 2) {
        return scoredRides[0];
    }

    // Top 2 rides lo
    const bestRide = scoredRides[0];
    const secondRide = scoredRides[1];

    // Score difference calculate karo
    const percentageDifference = calculateScoreDifference(bestRide, secondRide);

    // Agar difference 5% se kam hai
    // Carbon compare karo
        if (percentageDifference < 0.05) {
            return applyEcoTieBreaker(bestRide, secondRide);
        }

    // Agar tie-break condition trigger nahi hui
    return bestRide;
}

