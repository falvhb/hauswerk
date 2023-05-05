import { writeFileSync } from "fs";

const data = await fetch("https://api.my-hammer.de/graphql", {
  headers: {
    accept: "*/*",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/json",
    pragma: "no-cache",
    "sec-ch-ua":
      '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    Referer: "https://www.my-hammer.de/",
    "Referrer-Policy": "origin-when-cross-origin",
  },
  body: '{"operationName":"serviceProProfileReviews","variables":{"serviceProSlug":"hauswerk-2","first":100},"query":"query serviceProProfileReviews($serviceProSlug: String!, $first: Int!, $after: String) {\\n  serviceProBySlug(serviceProSlug: $serviceProSlug) {\\n    slug\\n    companyProfile {\\n      companyName\\n      primaryLocation {\\n        localityNode {\\n          name\\n          __typename\\n        }\\n        __typename\\n      }\\n      rating\\n      companyLogo {\\n        sizes {\\n          small\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    reviews(after: $after, first: $first) {\\n      ...reviewsFragment\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment reviewsFragment on ReviewsConnection {\\n  pageInfo {\\n    hasNextPage\\n    hasPreviousPage\\n    endCursor\\n    startCursor\\n    __typename\\n  }\\n  totalCount\\n  edges {\\n    isRecommendation\\n    node {\\n      id\\n      averageRatingScore\\n      createdAt\\n      clientExperience\\n      status\\n      isAnonymous\\n      ... on ExternalReview {\\n        title\\n        __typename\\n      }\\n      ... on ConsumerReview {\\n        consumer {\\n          firstName\\n          __typename\\n        }\\n        serviceRequest {\\n          id\\n          slug\\n          title\\n          location {\\n            localityNode {\\n              name\\n              __typename\\n            }\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      averageRatingScore\\n      images {\\n        id\\n        sizes {\\n          medium\\n          original\\n          __typename\\n        }\\n        __typename\\n      }\\n      response {\\n        id\\n        response\\n        createdAt\\n        updatedAt\\n        images {\\n          id\\n          sizes {\\n            medium\\n            original\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n"}',
  method: "POST",
});

const json = await data.json();

const ratings = [];

json.data.serviceProBySlug.reviews.edges.map((edge) => {
  ratings.push({
    reviewer_name: edge.node.consumer?.firstName || "Anonymous",
    job_title: edge.node.serviceRequest?.title || "Auftrag",
    written_at: edge.node.createdAt,
    averageRatingScore: edge.node.averageRatingScore,
    text: edge.node.clientExperience,
  });
});

console.log("Einträge migriert:", ratings.length);

const dataToWrite = JSON.stringify({ body: ratings });

writeFileSync("src/components/reviews.json", dataToWrite);
