import styles from "../styles/Metadata.module.css"



export default function Metadata({ data }) {

    function metaprops(data) {
        let out = ""
        if (data.attributes) {
            for (obj in data.attributes) {
                out += ""
            }
        }
    }


    return (
        <div className={styles.body}>
            {JSON.stringify(data, null, 2)}
            <table>
                <thead>
                    <tr>
                        <th>
                            Attribute
                        </th>
                        <th>
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>

                    </tr>
                </tbody>
            </table>

        </div>
    )
}