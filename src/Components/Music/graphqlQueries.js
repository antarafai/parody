// graphqlQueries.js

export const fileUploadRequestMutation = `
  mutation FileUploadRequestMutation {
    fileUploadRequest {
      id
      uploadUrl
    }
  }
`;

export const libraryTrackCreateMutation = `
  mutation LibraryTrackCreateMutation($input: LibraryTrackCreateInput!) {
    libraryTrackCreate(input: $input) {
      __typename
      ... on LibraryTrackCreateSuccess {
        createdLibraryTrack {
          id
        }
      }
      ... on LibraryTrackCreateError {
        code
        message
      }
    }
  }
`;

export const libraryTrackQuery = `
  query LibraryTrackQuery($id: ID!) {
    libraryTrack(id: $id) {
      __typename
      ... on LibraryTrack {
        id
        audioAnalysisV6 {
          __typename
          ... on AudioAnalysisV6Finished {
            result {
              genreTags
              transformerCaption
            }
          }
        }
      }
      ... on LibraryTrackNotFoundError {
        message
      }
    }
  }
`;