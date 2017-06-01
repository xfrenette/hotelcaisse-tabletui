import DatePicker from 'components/elements/DatePicker';

describe('DatePicker.buildDate', () => {
	test('returns Date', () => {
		const res = DatePicker.buildDate(2017, 5, 30);
		expect(res).toBeInstanceOf(Date);
	});

	test('returns expected date', () => {
		const res = DatePicker.buildDate(2017, 5, 30);
		expect(res.getFullYear()).toBe(2017);
		expect(res.getMonth()).toBe(5);
		expect(res.getDate()).toBe(30);
	});

	test('returned date has time 00:00:00:0000', () => {
		const res = DatePicker.buildDate(2017, 5, 30);
		expect(res.getHours()).toBe(0);
		expect(res.getMinutes()).toBe(0);
		expect(res.getSeconds()).toBe(0);
		expect(res.getMilliseconds()).toBe(0);
	});
});
