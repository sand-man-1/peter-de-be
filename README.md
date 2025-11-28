# peter-de-be
Transaction Pivot table SPA for BE pos




# Imporvemnets
Right now all pivot aggregation happens in the browser. For larger datasets, I’d introduce a /api/pivot endpoint and push the heavy grouping/summing into PostgreSQL (e.g. using GROUP BY year, status, transaction_type). The frontend would then only render the already-aggregated data.


# 1
Add filters (e.g. by year, status, transaction type, min/max amount, date range) so users can slice the dataset before building the pivot. This would reduce data size and make the pivot more focused.

# 2
Instead of loading and rendering all raw transactions at once, I’d add backend pagination (e.g. /api/transactions?page=...) and corresponding controls in the UI, to keep the raw table responsive with large datasets.

# 3
Add an “Export pivot” button so users can download the current pivot view as CSV/Excel for further analysis in tools like Excel, Google Sheets or BI tools.

# 4
Extend tests beyond the current unit tests for buildPivot and PivotTable to include:
Backend tests for /api/transactions (and /api/pivot if implemented)
Integration tests that fetch real data and verify the rendered pivot
More UI tests for different pivot configurations and edge cases (no data, bad data, etc.).

# 5
Profile the client-side aggregation and rendering (especially with 10k+ rows) and optimise where necessary by:
Memoising pivot calculations (e.g. useMemo) when inputs haven’t changed
Using virtualised tables for the raw transaction list
Minimising unnecessary re-renders in React.

# 6
Improve the backend integration by:
Using proper environment configs per environment (dev/stage/prod)
Adding basic authentication/authorisation around the API if this were used in a real setting (e.g. only logged-in users can view transaction data).