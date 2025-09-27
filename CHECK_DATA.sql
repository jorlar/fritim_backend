-- Check what data already exists in your database

-- Check clubs
SELECT 'Clubs' as table_name, COUNT(*) as record_count FROM clubs;

-- Check funds
SELECT 'Funds' as table_name, COUNT(*) as record_count FROM funds;

-- Check fund transactions
SELECT 'Fund Transactions' as table_name, COUNT(*) as record_count FROM fund_transactions;

-- Check equipment listings
SELECT 'Equipment Listings' as table_name, COUNT(*) as record_count FROM equipment_listings;

-- Show existing clubs
SELECT id, name, short_name, sport, location FROM clubs ORDER BY created_at;

-- Show existing funds
SELECT f.id, c.name as club_name, f.current_amount, f.monthly_goal, f.yearly_goal, f.last_updated
FROM funds f 
JOIN clubs c ON f.club_id = c.id 
ORDER BY f.last_updated;
