-- Insert sample clubs (only if they don't exist)
INSERT INTO clubs (id, name, short_name, sport, location, member_count, established, description, primary_color, secondary_color, logo) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Fritim Idrettslag', 'Fritim', 'Fotball & Idrett', 'Oslo, Norge', 245, 1985, 'Et aktivt idrettslag med fokus på fotball, håndball og allidrett for alle aldre.', '#1a365d', '#2d5a87', '⚽'),
('550e8400-e29b-41d4-a716-446655440002', 'Fjellkameratene SK', 'Fjellkameratene', 'Ski & Friidrett', 'Lillehammer, Norge', 180, 1972, 'Skiklubb med tradisjoner innen langrenn, hopp og friidrett i hjertet av Gudbrandsdalen.', '#2d5016', '#4a7c59', '🎿'),
('550e8400-e29b-41d4-a716-446655440003', 'Kysten Fotballklubb', 'Kysten FK', 'Fotball', 'Bergen, Norge', 320, 1990, 'Bergens største fotballklubb med lag fra 6-års alderen opp til seniornivå.', '#7c2d12', '#dc2626', '⚽')
ON CONFLICT (id) DO NOTHING;

-- Insert funds for each club (only if they don't exist)
INSERT INTO funds (id, club_id, current_amount, monthly_goal, yearly_goal) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 125000, 150000, 2000000),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 98000, 120000, 1500000),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 156000, 180000, 2200000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample fund transactions (only if they don't exist)
INSERT INTO fund_transactions (id, fund_id, amount, transaction_type, description, created_by) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 5000, 'donation', 'Donasjon mottatt', null),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', -12000, 'expense', 'Utstyr kjøpt', null),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 8500, 'dugnad_income', 'Dugnad inntekt', null),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', 3200, 'donation', 'Donasjon mottatt', null),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', 7800, 'dugnad_income', 'Dugnad inntekt', null)
ON CONFLICT (id) DO NOTHING;
