import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import React from "react";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import {
  BooleanFacet,
  Layout,
  SingleLinksFacet,
  SingleSelectFacet
} from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import "../src/search.css"

const connector = new AppSearchAPIConnector({
  searchKey: "search-asrw1c4rzo3b5nx7e7qea3dv",
  engineName: "qpm-search-dev",
  endpointBase: "https://engine-romain.ent.eu-west-3.aws.elastic-cloud.com"
});
const config = {
  debug: true,
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    result_fields: {
      // section result field
      title: { 
        raw: {} 
      },
      document: {
        snippet: {
          fallback: true
        }
       },
       /*nps_link: {
         raw: {}
       },*/
       content: {
         snippet: {
           size: 1000, 
           fallback: true
         }
       }
    },
    search_fields: {
      // section search field for searchbar
      document: {
        weight: 5
      },
      content: {
        weight: 10
      }
    },
    disjunctiveFacets: [""],
    facets: {
      // section facet parameter
      facet: { type: "value" },
      author: { type: "value"},
      extension: { type: "value"},
      page: { type: "value"},
      creation_date: {
        type: "range",
        ranges: [
          {
            from: '2020-01-01T01:01:33.420Z',
            name: "Les anciens documents"
          },
          {
            from: '2021-01-01T01:01:33.420Z',
            to: '2021-12-31T23:59:33.420Z',
            name: "Les documents en 2021"
          },
          {
            to: '2022-01-01T01:01:33.420Z',
            name: "Les documents de 2022"
          }
        ]
      },
      modification_date: {
        type: "range",
        ranges: [

          {
            from: '2021-01-01T01:01:33.420Z',
            to: '2021-12-31T23:59:33.420Z',
            name: "Document modifié en 2021"
          },
          {
            to: '2022-01-01T01:01:33.420Z',
            name: "Document modifié cette année"
          }
        ]
      },
    }
  }
};
export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch
        mapContextToProps={({ wasSearched }) => ({
          wasSearched
        })}
      >
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={
                  <SearchBox 
                    autocompleteResults={{
                    sectionTitle: "Suggested Results",
                    titleField: "title",
                    urlField: "nps_link",
                  }}
                  autocompleteSuggestions={{
                    sectionTitle: "Suggested Queries"
                  }}                                   
                    /*debounceLength={0}*/ />}
                  sideContent={
                  // lateral sidebar
                  <div>
                    <Facet
                    field="facet"
                    label="Grand-compte"
                    filterType="any"
                    isFilterable={true}
                    />
                    <Facet
                    field="author"
                    label="Auteur"
                    filterType="any"
                    isFilterable={true}
                    />
                    <Facet
                    field="extension"
                    label="extention"
                    filterType="any"
                    isFilterable={false}
                    />
                    <Facet
                    field="page"
                    label="pages"
                    filterType="any"
                    isFilterable={false}
                    />
                    <Facet
                    field="creation_date"
                    label="date de création"
                    filterType="any"
                    />
                    <Facet
                    field="modification_date"
                    label="date de modification"
                    filterType="any"
                    />
                    </div>}
                  bodyContent={
                    <Results
                      titleField="document"
                      urlField="nps_link"
                      thumbnailField="image_url"
                      shouldTrackClickThrough
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}