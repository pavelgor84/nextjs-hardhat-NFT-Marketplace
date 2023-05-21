import styles from "../styles/Metadata.module.css"



export default function Metadata({ data }) {

    let table = ""
    if (data.attributes) {
        table = data.attributes.map((item) => {
            return (
                <tr key={item.trait_type + "1"}>
                    <td>{item.trait_type}</td>
                    <td>{item.value}</td>
                </tr>
            )
        })

    }


    return (
        <div className={styles.body}>

            <table>

                <tbody>
                    {table}
                </tbody>
            </table>

        </div>
    )
}