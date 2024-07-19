// import SeoForm from './components/SeoForm';
// import SeoList from './components/SeoList';
// import SeoEdit from './components/SeoEdit';


// const App = () => {
//   const [seoEntries, setSeoEntries] = useState([]);

//   const fetchSeoEntries = async () => {
//     try {
//       const response = await axios.get('/api/seo');
//       setSeoEntries(response.data);
//     } catch (error) {
//       console.error('Error fetching SEO entries', error);
//     }
//   };

//   useEffect(() => {
//     fetchSeoEntries();
//   }, []);