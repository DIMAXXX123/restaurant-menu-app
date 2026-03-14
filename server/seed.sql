-- Monochrome Café – Seed Data (50+ menu items)

INSERT INTO menu_items (name, description, price, category, emoji, available) VALUES

-- ══════════════════════════════════════
-- POPULAR (8 items)
-- ══════════════════════════════════════
('Café Viennois', 'Espresso topped with lightly whipped cream, dusted with cocoa powder. A Viennese classic.', 4.50, 'popular', '☕', true),
('Avocado Toast', 'Sourdough bread, smashed avocado, cherry tomatoes, chilli flakes, and a poached egg.', 11.50, 'popular', '🥑', true),
('Eggs Benedict', 'Toasted English muffin, Canadian bacon, perfectly poached eggs, and hollandaise sauce.', 13.50, 'popular', '🍳', true),
('Croissant au Beurre', 'Buttery, flaky French croissant baked fresh every morning. Served with house jam.', 3.80, 'popular', '🥐', true),
('Cappuccino', 'Double shot espresso with silky steamed milk foam. Art poured on every cup.', 4.20, 'popular', '☕', true),
('Tiramisu', 'Classic Italian dessert – layers of mascarpone cream, espresso-soaked ladyfingers, cocoa.', 7.50, 'popular', '🍰', true),
('Club Sandwich', 'Triple-decker with chicken, crispy bacon, lettuce, tomato, Dijon mayo, on toasted white.', 12.50, 'popular', '🥪', true),
('Acai Bowl', 'Blended acai with banana, topped with granola, fresh berries, coconut flakes, honey drizzle.', 9.80, 'popular', '🫐', true),

-- ══════════════════════════════════════
-- HOT DRINKS (7 items)
-- ══════════════════════════════════════
('Espresso', 'Single origin Ethiopian Yirgacheffe. Bright, fruity, and intensely aromatic.', 2.80, 'hot-drinks', '☕', true),
('Doppio', 'Double espresso – bold, rich, and smooth. The foundation of all great coffee.', 3.40, 'hot-drinks', '☕', true),
('Flat White', 'Two ristretto shots with velvety micro-foam milk. Stronger than a latte, creamier than an espresso.', 4.20, 'hot-drinks', '☕', true),
('Matcha Latte', 'Ceremonial grade Japanese matcha whisked with oat milk and a touch of agave.', 5.20, 'hot-drinks', '🍵', true),
('London Fog', 'Earl Grey tea, vanilla syrup, and steamed milk. Floral, fragrant, and comforting.', 4.80, 'hot-drinks', '🫖', true),
('Hot Chocolate', 'Rich Belgian dark chocolate melted with whole milk. Topped with house-made whipped cream.', 5.00, 'hot-drinks', '🍫', true),
('Chai Latte', 'Spiced masala chai concentrate with steamed oat milk and cinnamon dust on top.', 4.80, 'hot-drinks', '🌶️', true),

-- ══════════════════════════════════════
-- COLD DRINKS (7 items)
-- ══════════════════════════════════════
('Cold Brew', '20-hour slow-steeped Colombian cold brew. Smooth, low-acid, naturally sweet.', 5.50, 'cold-drinks', '🧊', true),
('Iced Matcha Latte', 'Ceremonial matcha shaken with oat milk over ice. Vibrant and refreshing.', 5.80, 'cold-drinks', '🍵', true),
('Sparkling Lemonade', 'House-pressed lemon juice, sparkling water, agave, fresh mint. Tall and effervescent.', 4.20, 'cold-drinks', '🍋', true),
('Berry Smoothie', 'Blended wild berries, banana, coconut milk, and a scoop of protein. Thick and satisfying.', 6.50, 'cold-drinks', '🫐', true),
('Fresh Orange Juice', 'Squeezed to order from premium Valencia oranges. Pure, pulpy, and sun-kissed.', 4.80, 'cold-drinks', '🍊', true),
('Iced Americano', 'Double espresso poured over ice with a splash of cold water. Pure coffee simplicity.', 4.00, 'cold-drinks', '☕', true),
('Kombucha of the Day', 'House-brewed kombucha in rotating seasonal flavours. Ask your server for today''s batch.', 5.00, 'cold-drinks', '🍶', true),

-- ══════════════════════════════════════
-- BREAKFAST (7 items)
-- ══════════════════════════════════════
('Full Viennese Breakfast', 'Two eggs your way, house sausage, grilled tomato, sautéed mushrooms, toast, and fresh juice.', 15.50, 'breakfast', '🍳', true),
('Bircher Muesli', 'Overnight oats with grated apple, yoghurt, toasted almonds, and seasonal fruit compote.', 8.50, 'breakfast', '🌾', true),
('Pancake Stack', 'Three fluffy buttermilk pancakes with maple syrup, fresh berries, and whipped cream.', 10.50, 'breakfast', '🥞', true),
('Smashed Avocado & Feta', 'Thick sourdough with smashed avo, crumbled feta, dukkah, pomegranate seeds, and lemon zest.', 12.00, 'breakfast', '🥑', true),
('Granola Bowl', 'House-toasted granola with Greek yoghurt, honey, seasonal berries, and chia seeds.', 8.00, 'breakfast', '🥣', true),
('Shakshuka', 'Eggs poached in spiced tomato sauce with peppers and onion. Served with crusty bread.', 12.50, 'breakfast', '🍅', true),
('French Toast', 'Brioche soaked in vanilla custard, pan-fried golden, topped with caramelised banana and cream.', 11.00, 'breakfast', '🍞', true),

-- ══════════════════════════════════════
-- LIGHT BITES (6 items)
-- ══════════════════════════════════════
('Cheese Board', 'Selection of three artisan cheeses, quince paste, walnuts, grapes, and crackers.', 14.50, 'light-bites', '🧀', true),
('Charcuterie Plate', 'Cured meats, cornichons, Dijon mustard, pickled onions, and sourdough crisps.', 15.50, 'light-bites', '🥩', true),
('Soup of the Day', 'Chef''s daily creation made from seasonal vegetables. Served with artisan bread roll.', 7.50, 'light-bites', '🍲', true),
('Hummus & Pita', 'House-made creamy hummus, warm pita wedges, olive oil, za''atar, and roasted chickpeas.', 8.50, 'light-bites', '🫓', true),
('Bruschetta Trio', 'Three slices of toasted ciabatta: classic tomato-basil, ricotta-honey, and tapenade.', 9.50, 'light-bites', '🍅', true),
('Mezze Platter', 'Hummus, tzatziki, baba ganoush, falafel, olives, and warm flatbread for two.', 18.00, 'light-bites', '🫙', true),

-- ══════════════════════════════════════
-- SANDWICHES (6 items)
-- ══════════════════════════════════════
('Croque Monsieur', 'Ham and Gruyère on thick white bread, béchamel-grilled to golden perfection.', 10.50, 'sandwiches', '🧀', true),
('Tuna Niçoise Wrap', 'Wild tuna, soft-boiled egg, olives, green beans, and Dijon dressing in a spinach wrap.', 11.50, 'sandwiches', '🌯', true),
('BLT Sourdough', 'Crispy streaky bacon, heirloom tomato, butter lettuce, and lemon aioli on toasted sourdough.', 10.00, 'sandwiches', '🥓', true),
('Roasted Veg Ciabatta', 'Grilled zucchini, capsicum, eggplant, rocket, pesto, and burrata on ciabatta.', 11.00, 'sandwiches', '🥗', true),
('Pulled Chicken Brioche', 'Slow-cooked pulled chicken with chipotle slaw and pickled jalapeño on a toasted brioche bun.', 13.00, 'sandwiches', '🍗', true),
('Smoked Salmon Bagel', 'House-cured smoked salmon, cream cheese, capers, red onion, dill, on a sesame bagel.', 13.50, 'sandwiches', '🐟', true),

-- ══════════════════════════════════════
-- MAINS (7 items)
-- ══════════════════════════════════════
('Wiener Schnitzel', 'Hand-pounded veal schnitzel, golden breadcrumb crust, parsley potato, lingonberry jam.', 19.50, 'mains', '🥩', true),
('Pasta Carbonara', 'Rigatoni with guanciale, egg yolk, aged Pecorino Romano, and cracked black pepper.', 16.50, 'mains', '🍝', true),
('Grilled Salmon', 'Atlantic salmon fillet, lemon-caper beurre blanc, wilted spinach, roasted baby potatoes.', 18.50, 'mains', '🐟', true),
('Mushroom Risotto', 'Creamy Arborio rice with porcini, truffle oil, aged Parmesan, and fresh herbs.', 15.50, 'mains', '🍄', true),
('Chicken Caesar Salad', 'Romaine, grilled chicken breast, house Caesar dressing, Parmesan shavings, anchovy croutons.', 14.50, 'mains', '🥗', true),
('Beef Burger', '180g dry-aged beef patty, aged Cheddar, caramelised onion, house pickles, chipotle mayo, brioche bun.', 17.00, 'mains', '🍔', true),
('Vegetable Tagine', 'Moroccan spiced chickpeas, root vegetables, apricots, and almonds. Served with couscous.', 15.00, 'mains', '🫙', true),

-- ══════════════════════════════════════
-- DESSERTS (6 items)
-- ══════════════════════════════════════
('Sachertorte', 'Vienna''s iconic chocolate cake – dense, apricot-glazed, with house-made whipped cream.', 7.50, 'desserts', '🎂', true),
('Crème Brûlée', 'Silky vanilla custard beneath a perfectly torched caramelised sugar crust.', 7.00, 'desserts', '🍮', true),
('Lemon Tart', 'Buttery shortcrust pastry, intensely lemony curd, Italian meringue, lemon zest.', 7.50, 'desserts', '🍋', true),
('Affogato', 'A scoop of vanilla gelato "drowned" in a shot of hot espresso. Simple. Sublime.', 6.50, 'desserts', '🍨', true),
('Chocolate Fondant', 'Warm dark chocolate cake with a molten centre, served with vanilla ice cream.', 8.50, 'desserts', '🍫', true),
('Apple Strudel', 'Flaky pastry filled with cinnamon apples, raisins, and walnuts. Served warm with cream.', 7.00, 'desserts', '🍎', true)

ON CONFLICT DO NOTHING;
