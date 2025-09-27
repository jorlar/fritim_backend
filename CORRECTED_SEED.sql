-- Insert sample clubs
INSERT INTO clubs (id, name, short_name, sport, location, member_count, established, description, primary_color, secondary_color, logo) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Fritim Idrettslag', 'Fritim', 'Fotball & Idrett', 'Oslo, Norge', 245, 1985, 'Et aktivt idrettslag med fokus på fotball, håndball og allidrett for alle aldre.', '#1a365d', '#2d5a87', '⚽'),
('550e8400-e29b-41d4-a716-446655440002', 'Fjellkameratene SK', 'Fjellkameratene', 'Ski & Friidrett', 'Lillehammer, Norge', 180, 1972, 'Skiklubb med tradisjoner innen langrenn, hopp og friidrett i hjertet av Gudbrandsdalen.', '#2d5016', '#4a7c59', '🎿'),
('550e8400-e29b-41d4-a716-446655440003', 'Kysten Fotballklubb', 'Kysten FK', 'Fotball', 'Bergen, Norge', 320, 1990, 'Bergens største fotballklubb med lag fra 6-års alderen opp til seniornivå.', '#7c2d12', '#dc2626', '⚽');

-- Insert funds for each club
INSERT INTO funds (id, club_id, current_amount, monthly_goal, yearly_goal) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 125000, 150000, 2000000),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 98000, 120000, 1500000),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 156000, 180000, 2200000);

-- Insert sample equipment listings
INSERT INTO equipment_listings (id, title, description, price, original_price, condition, category, seller_id, club_id, is_for_sale, contact_info) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Nike Mercurial Vapor 14', 'Profesjonelle fotballsko i størrelse 42. Brukt i 3 måneder, perfekt tilstand.', 800, 1200, 'Brukt - som ny', 'Fotball', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', true, 'erik.hansen@email.com'),
('770e8400-e29b-41d4-a716-446655440002', 'Håndballsko - Adidas Stabil', 'Håndballsko i størrelse 41. Brukt i 6 måneder, god stand.', 0, null, 'Brukt - god stand', 'Håndball', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', false, 'maria.olsen@email.com'),
('770e8400-e29b-41d4-a716-446655440003', 'Langrennsski - Fischer', 'Profesjonelle langrennsski, 180cm. Brukt i 2 sesonger, god stand.', 1500, 2500, 'Brukt - god stand', 'Ski', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', true, 'lars.andersen@email.com'),
('770e8400-e29b-41d4-a716-446655440004', 'Tennissett - Wilson', 'Komplett tennissett med racket, baller og net. Perfekt for begynnere.', 0, null, 'Brukt - brukbar stand', 'Tennis', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', false, 'anna.berg@email.com'),
('770e8400-e29b-41d4-a716-446655440005', 'Svømmebriller - Speedo', 'Profesjonelle svømmebriller, brukt i 2 måneder. Perfekt tilstand.', 200, 350, 'Brukt - som ny', 'Svømming', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', true, 'tommy.larsen@email.com'),
('770e8400-e29b-41d4-a716-446655440006', 'Friidrettssko - Asics', 'Spikesko for friidrett, størrelse 43. Brukt i 1 sesong, god stand.', 600, 900, 'Brukt - god stand', 'Friidrett', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', true, 'sofia.johansen@email.com');

-- Insert sample fund transactions
INSERT INTO fund_transactions (id, fund_id, amount, transaction_type, description, created_by) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 5000, 'donation', 'Donasjon mottatt', '550e8400-e29b-41d4-a716-446655440004'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', -12000, 'expense', 'Utstyr kjøpt', '550e8400-e29b-41d4-a716-446655440004'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', 8500, 'dugnad_income', 'Dugnad inntekt', '550e8400-e29b-41d4-a716-446655440004'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', 3200, 'donation', 'Donasjon mottatt', '550e8400-e29b-41d4-a716-446655440005'),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440003', 7800, 'dugnad_income', 'Dugnad inntekt', '550e8400-e29b-41d4-a716-446655440005');
