describe('Jack Shields Christensen site', () => {
	it('has the correct <h1> on the home page', () => {
		cy.visit('/');
		cy.contains('h1', 'Jack Shields Christensen');
	});

	it('shows the four nav sections', () => {
		cy.visit('/');
		cy.get('nav').contains('HOME');
		cy.get('nav').contains('Featured');
		cy.get('nav').contains('Contents');
		cy.get('nav').contains('Contact');
	});

	it('navigates to a content page', () => {
		cy.visit('/contents/japan/favorite-japanese-sayings');
		cy.contains('h2', 'FAVORITE JAPANESE SAYINGS');
	});

	it('renders a poem with a return link', () => {
		cy.visit('/featured/poems/single-sentence-poems/distant-passages/ise');
		cy.contains('a', 'Return to Poem titles');
	});
});
