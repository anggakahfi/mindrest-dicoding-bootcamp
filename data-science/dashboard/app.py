"""
Streamlit Dashboard 

Cara running dashboard:
    streamlit run dashboard/app.py
"""

import json
from pathlib import Path

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# Konfigurasi halaman
st.set_page_config(
    page_title='Twitter Sentiment — Mental Health',
    page_icon='',
    layout='wide',
)

# Konstanta
PROCESSED_DIR = Path('datasets/processed')

PAL = {'Positive': '#00C896', 'Neutral': '#4A9EFF', 'Negative': '#FF5A5A'}

DARK_LAYOUT = dict(
    paper_bgcolor='#0D1117',
    plot_bgcolor='#161B22',
    font_color='#E6EDF3',
)


# Fungsi load data
@st.cache_data
def load_data() -> tuple[pd.DataFrame, dict, dict, dict]:
    """Muat semua dataset dari folder processed."""
    df = pd.read_csv(PROCESSED_DIR / 'twitter_clean.csv')

    with open(PROCESSED_DIR / 'top_hashtags.json') as f:
        top_hashtags = json.load(f)

    with open(PROCESSED_DIR / 'ab_results.json') as f:
        ab_results = json.load(f)

    with open(PROCESSED_DIR / 'assessment.json') as f:
        assessment = json.load(f)

    return df, top_hashtags, ab_results, assessment


# Load data
try:
    df, top_hashtags, ab_results, assessment = load_data()
except FileNotFoundError as e:
    st.error(f' File tidak ditemukan: {e}\nJalankan `01_data_wrangling.ipynb` terlebih dahulu.')
    st.stop()


# Header
st.title('Twitter Sentiment Analysis')
st.caption('Dashboard untuk analisis sentimen Twitter dengan topik kesehatan mental.\n')
st.divider()

# Metrik Utama
col1, col2, col3, col4 = st.columns(4)

dist = df['sentiment'].value_counts()

col1.metric('Total Tweet (Clean)', f"{len(df):,}")
col2.metric('Sentimen Negatif', f"{dist.get('Negative', 0):,}", f"{dist.get('Negative', 0) / len(df) * 100:.1f}%")
col3.metric('Sentimen Netral', f"{dist.get('Neutral', 0):,}", f"{dist.get('Neutral', 0) / len(df) * 100:.1f}%")
col4.metric('Sentimen Positif', f"{dist.get('Positive', 0):,}", f"{dist.get('Positive', 0) / len(df) * 100:.1f}%")

st.divider()

# Tab 
tab_eda, tab_hashtag, tab_ab, tab_data = st.tabs(
    ['EDA', 'Hashtag', 'A/B Testing', 'Data']
)


# Tab 1: EDA
with tab_eda:
    st.subheader('Distribusi Sentimen')

    col_pie, col_bar = st.columns(2)

    with col_pie:
        fig_pie = px.pie(
            values=dist.values,
            names=dist.index,
            color=dist.index,
            color_discrete_map=PAL,
            hole=0.4,
        )
        fig_pie.update_layout(**DARK_LAYOUT, showlegend=True)
        st.plotly_chart(fig_pie, use_container_width=True)

    with col_bar:
        feature = st.selectbox(
            'Pilih fitur untuk distribusi:',
            ['word_count', 'text_length_clean', 'hashtag_count', 'hashtag_density'],
        )
        fig_hist = px.histogram(
            df, x=feature, color='sentiment',
            color_discrete_map=PAL, barmode='overlay', opacity=0.6,
            nbins=50,
        )
        fig_hist.update_layout(**DARK_LAYOUT)
        st.plotly_chart(fig_hist, use_container_width=True)

    st.subheader('Statistik Deskriptif per Sentimen')
    feature_cols = ['word_count', 'text_length_clean', 'hashtag_count', 'hashtag_density', 'avg_word_len']
    stats_table = df.groupby('sentiment')[feature_cols].mean().round(3)
    st.dataframe(stats_table, use_container_width=True)


# Tab 2: Hashtag
with tab_hashtag:
    st.subheader('Top 20 Hashtag per Sentimen')

    sentiment_filter = st.radio('Sentimen:', ['Positive', 'Neutral', 'Negative'], horizontal=True)
    top_n = st.slider('Jumlah hashtag:', min_value=5, max_value=20, value=10)

    data_ht = top_hashtags[sentiment_filter][:top_n]
    tags     = [f'#{d[0]}' for d in data_ht]
    freqs    = [d[1] for d in data_ht]

    fig_ht = go.Figure(go.Bar(
        x=freqs[::-1], y=tags[::-1],
        orientation='h',
        marker_color=PAL[sentiment_filter],
    ))
    fig_ht.update_layout(
        **DARK_LAYOUT,
        title=f'Top {top_n} Hashtag — Sentimen {sentiment_filter}',
        xaxis_title='Frekuensi',
        height=400,
    )
    st.plotly_chart(fig_ht, use_container_width=True)

    if sentiment_filter == 'Negative':
        st.info('💡 **Ironi Digital:** Hashtag seperti #happy dan #excited sering muncul '
                'dalam tweet bersentimen negatif — kemungkinan besar digunakan secara ironis.')


# Tab 3: A/B Testing
with tab_ab:
    st.subheader('Hasil Uji Statistik')

    for key, result in ab_results.items():
        with st.expander(f"{'' if result['significant'] else ''} {result['metric']} — {result['test']}"):
            col_info, col_verdict = st.columns([2, 1])

            with col_info:
                st.write(f"**H₀:** {result['h0']}")
                st.write(f"**Uji:** {result['test']}")
                st.write(f"**p-value:** {result['pvalue']:.6f}" if result['pvalue'] >= 0.0001
                         else '**p-value:** < 0.0001')

                if 'mean_a' in result:
                    st.write(f"**Mean {result['group_a']}:** {result['mean_a']}")
                    st.write(f"**Mean {result['group_b']}:** {result['mean_b']}")
                elif 'means' in result:
                    for group, mean in zip(result['groups'], result['means']):
                        st.write(f"**Mean {group}:** {mean}")

            with col_verdict:
                if result['significant']:
                    st.success('SIGNIFIKAN\n\nTolak H₀')
                else:
                    st.warning('Tidak Signifikan\n\nGagal Tolak H₀')


# Tab 4: Data
with tab_data:
    st.subheader('Preview Dataset Bersih')

    sentiment_opt = st.multiselect(
        'Filter sentimen:',
        options=['Positive', 'Neutral', 'Negative'],
        default=['Positive', 'Neutral', 'Negative'],
    )

    df_filtered = df[df['sentiment'].isin(sentiment_opt)] if sentiment_opt else df
    st.dataframe(df_filtered.head(100), use_container_width=True)
    st.caption(f'Menampilkan 100 dari {len(df_filtered):,} baris')
